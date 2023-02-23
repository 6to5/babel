// Many thanks to the author of https://gist.github.com/TravisMullen/16dfabca0db4bb4c32fb4f5ef297b25a

import { readFile, access, constants } from 'node:fs/promises';
import { dirname, extname, join, resolve as resolvePath } from 'node:path';
import { cwd, env } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import Module from 'module'

// TODO: make this work without that flag aswell
env.BABEL_8_BREAKING = true
global.BABEL_FLAG = {}

const { default: opts } = await import(env.BABEL_REGISTER || join(cwd(), 'register.mjs'))

import { isInRegisterWorker } from './src/is-in-register-worker.js'

let JS_EXTENSIONS
let magic
let client

if (!isInRegisterWorker) {
  const { default: BabelWorker } = await import('./src/experimental-worker.js')
  magic = BabelWorker(opts)
  client = magic().client
  JS_EXTENSIONS = new Set(opts.extensions ?? client.getDefaultExtensions())
}

function tryCJSResolve(specifier, context, nextResolve) {
  const { parentURL } = context
  let fakeParent

  if (parentURL) {
    const { pathname: parentPathname } = new URL(parentURL)

    fakeParent = {
      loaded: true,
      filename: parentPathname,
      id: parentPathname,
      paths: Module._nodeModulePaths(dirname(parentPathname))
    }
  }
  let resolved

  try {
    resolved = Module._resolveFilename(specifier, fakeParent)
  } catch(error) {
    // do nothing
  }

  if (resolved) {
    return pathToFileURL(resolved).href
  }
}

async function tryESMResolve(specifier, context, nextResolve) {
  try {
    const next = await nextResolve(specifier, context)
    return next.url
  } catch(error) {
    // do nothing
  }
}

async function exists(path) {
  try {
    await access(path, constants.R_OK)
    return true
  } catch(error) {
    // do nothing
  }
}

export async function resolve (specifier, context, nextResolve) {
  // don't recurse ourselves to death
  // CONTEXT: some people like to specify the options in execArgv as well
  // so all children inherit them
  // it's nice to handle that
  if (isInRegisterWorker) {
    return nextResolve(specifier, context)
  }

  if (Module.builtinModules.includes(specifier)) {
    return nextResolve(specifier, context)
  }

  let resolved
  if (specifier.startsWith('file://')) { // already resolved
    resolved = specifier
  } else if ((resolved = tryCJSResolve(specifier, context, nextResolve))) {
    // NOTE: this is technically a hack since commonjs module resolution
    // gets extended by @babel/register/experimental-worker
    // in the future we could either use node's own cjs resolve function directly
    // or something of our own
  } else if ((resolved = await tryESMResolve(specifier, context, nextResolve))) {
    // last resort
  } else { // can't resolve, assume not for us
    return nextResolve(specifier, context)
  }

  const resolvedPath = fileURLToPath(resolved)

  const ext = extname(resolvedPath)

  if (resolved.startsWith('file://') && JS_EXTENSIONS.has(ext) && await exists(resolvedPath)) {
    const result = client.transform(String(await readFile(resolvedPath)), resolvedPath)

    if (result === null) { // shouldn't be handeled by us
      return nextResolve(specifier, context)
    }

    const { sourceType } = result

    global.BABEL_FLAG[resolved] = true

    // console.log('map', resolved)

    return { // will end up at load()
      url: resolved,
      format: sourceType,
      shortCircuit: true
    }
  } else {
    return nextResolve(specifier, context)
  }
}

export async function load(url, context, nextLoad) {
  if (global.BABEL_FLAG[url]) {
    // Imported files can be either CommonJS or ES modules, so we want any
    // imported file to be treated by Node.js the same as a .js file at the
    // same location. To determine how Node.js would interpret an arbitrary .js
    // file, search up the file system for the nearest parent package.json file
    // and read its "type" field.
    const format = await getPackageType(url);
    // When a hook returns a format of 'commonjs', `source` is be ignored.
    // The .register call at the beginning of the file already takes care of
    // the common-js file
    if (format === 'commonjs') {
      return {
        format,
        shortCircuit: true,
      };
    }

    const { source: rawSource, responseURL } = await nextLoad(url, { ...context, format });

    const file = fileURLToPath(responseURL)
    const result = client.transform(rawSource.toString(), file);

    if (result !== null) {
      // console.log(file, result.sourceType)
      if (result.map) {
        const { maps, installSourceMapSupport } = magic()
        maps[file] = result.map
        installSourceMapSupport()
      }
      return {
        format: result.sourceType,
        shortCircuit: true,
        source: result.code,
      };
    }
  }

  // Let Node.js handle all other URLs.
  return nextLoad(url);
}

async function getPackageType(url) {
  // `url` is only a file path during the first iteration when passed the
  // resolved url from the load() hook
  // an actual file path from load() will contain a file extension as it's
  // required by the spec
  // this simple truthy check for whether `url` contains a file extension will
  // work for most projects but does not cover some edge-cases (such as
  // extensionless files or a url ending in a trailing space)
  const isFilePath = !!extname(url);
  // If it is a file path, get the directory it's in
  const dir = isFilePath ?
    dirname(fileURLToPath(url)) :
    url;
  // Compose a file path to a package.json in the same directory,
  // which may or may not exist
  const packagePath = resolvePath(dir, 'package.json');
  // Try to read the possibly nonexistent package.json
  const type = await readFile(packagePath, { encoding: 'utf8' })
    .then((filestring) => JSON.parse(filestring).type)
    .catch((err) => {
      if (err?.code !== 'ENOENT') console.error(err);
    });
  // Ff package.json existed and contained a `type` field with a value, voila
  if (type) return type;
  // Otherwise, (if not at the root) continue checking the next directory up
  // If at the root, stop and return false
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}
