/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-conditions",
factory: function (require) {
var plugin=(()=>{var ie=Object.create;var H=Object.defineProperty;var re=Object.getOwnPropertyDescriptor;var se=Object.getOwnPropertyNames;var ae=Object.getPrototypeOf,ce=Object.prototype.hasOwnProperty;var g=(n=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(n,{get:(t,e)=>(typeof require<"u"?require:t)[e]}):n)(function(n){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+n+'" is not supported')});var le=(n,t)=>{for(var e in t)H(n,e,{get:t[e],enumerable:!0})},B=(n,t,e,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of se(t))!ce.call(n,o)&&o!==e&&H(n,o,{get:()=>t[o],enumerable:!(i=re(t,o))||i.enumerable});return n};var pe=(n,t,e)=>(e=n!=null?ie(ae(n)):{},B(t||!n||!n.__esModule?H(e,"default",{value:n,enumerable:!0}):e,n)),de=n=>B(H({},"__esModule",{value:!0}),n);var ke={};le(ke,{default:()=>ye});var N=g("@yarnpkg/core");var x=g("@yarnpkg/core");function M(n){let t="condition:";if(!n.startsWith(t,0))throw new Error(`Expected 'condition:' at index 0 (${n})`);let e=t.length;p();let i=d(/[\w-]+/y);if(!i)throw new Error(`Expected an identifier at index ${e} (${n})`);p(),l("?"),p();let o=null;n[e]==="("?o=u().trim()||null:n[e]!==":"&&(o=d(/[^(:]+/y)?.trimRight()||null),l(":"),p();let s=null;e<n.length&&(n[e]==="("&&!n.startsWith("esm:",e+1)?s=u().trim()||null:n[e]!==":"&&(s=d(/[^(#]+/y)?.trimRight()||null));let r=C("esm"),a=C("peer");!r&&a&&(r=C("esm"));let c=null;if(e<n.length&&n[e]==="#"&&(e++,c=d(/\w+/y),p()),e!==n.length)throw new Error(`Unexpected '${n[e]}' at index ${e} (${n})`);return{test:i,consequent:o,alternate:s,esmExports:r,peers:a,hash:c};function l(f){if(n[e]!==f)throw new Error(`Expected '${f}' at index ${e} (${n})`);e++}function p(){d(/\s*/y)}function d(f){f.lastIndex=e;let m=f.exec(n);return m?(e+=m[0].length,m[0]):null}function u(){l("(");let f=1,m="";for(;f;){if(e===n.length)throw new Error(`Expected ')' at index ${e} (${n})`);let y=n[e];y==="("&&f++,y===")"&&f--,(y!==")"||f>0)&&(m+=y),e++}return p(),m}function C(f){if(e<n.length&&n.startsWith(`(${f}:`,e)){let m=u().slice(f.length+1).trim();if(m)return m.split(",").map(y=>y.trim())}return null}}var S=["dependencies","devDependencies","peerDependencies"];function k(n){return n.startsWith("condition:")}function Q(n){try{return M(n)}catch(t){try{let{test:e,consequent:i,alternate:o,esmExports:s,peers:r}=x.structUtils.parseRange(n).params;return{test:e,consequent:i||null,alternate:o||null,esmExports:s||null,peers:r||null}}catch{throw t}}}function j(n){return Q(n.range)}function q(n){return Q(n.reference)}function fe({test:n,consequent:t,alternate:e,esmExports:i,peers:o,hash:s}){let r=`condition:${n}?`;return t&&(r+=t),r+=":",e&&(r+=e),i&&(r+=`(esm:${i.join(",")})`),o&&(r+=`(peer:${o.join(",")})`),s&&(r+=`#${s}`),r}function z(n,{test:t,consequent:e,alternate:i,esmExports:o,peers:s,hash:r}){return x.structUtils.makeLocator(n,fe({test:t,consequent:e,alternate:i,esmExports:o,peers:s,hash:r}))}function v(n,t,e,i,o){let s=x.structUtils.makeIdent(t.scope,`${t.name}-${e}-${o}`),r=n.configuration.get("defaultProtocol")+`${x.structUtils.stringifyIdent(t)}@${i}`;return x.structUtils.makeDescriptor(s,r)}function b(n,t,e,i,o,s){return x.hashUtils.makeHash(String(11),n,t||"-",e||"-",i?.join(",")||"-",o?.join(",")||"-",s?"1":"0").slice(0,6)}var O=g("@yarnpkg/core"),K={conditions:{description:"",type:O.SettingsType.MAP,valueDefinition:{description:"",type:O.SettingsType.SHAPE,properties:{source:{description:"",type:O.SettingsType.STRING,default:"env"},default:{description:"",type:O.SettingsType.BOOLEAN,default:!1}}}}};function T(n,t){if(!n.configuration.get("conditions").has(t))throw new Error(`Unknown condition: ${t}. You must add it to your .yarnrc.yml file.`)}function L(n,t){return T(n,t),n.configuration.get("conditions").get(t).get("default")}function R(n,t){T(n,t);let e=n.configuration.get("conditions").get(t),i=e.get("source"),o=e.get("default");if(i!=="env")throw new Error("The only supported configuration source is 'env'");return me(process.env[t])??o}function me(n){return n&&n!=="false"&&n!=="0"}var I=class{supportsDescriptor(t){return k(t.range)}supportsLocator(t){return k(t.reference)}shouldPersistResolution(){return!1}bindDescriptor(t){return t}getResolutionDependencies(t,e){let{test:i,consequent:o,alternate:s}=j(t),r={};return o&&(r.consequent=v(e.project,t,i,o,!0)),s&&(r.alternate=v(e.project,t,i,s,!1)),r}async getCandidates(t,e,i){let{test:o,consequent:s,alternate:r,esmExports:a,peers:c}=j(t),l=b(o,s,r,a,c,L(i.project,o));return[z(t,{test:o,consequent:s,alternate:r,esmExports:a,peers:c,hash:l})]}async getSatisfying(t,e,i,o){let[s]=await this.getCandidates(t,e,o);return{locators:i.filter(r=>r.locatorHash===s.locatorHash),sorted:!1}}async resolve(t,e){let{test:i,consequent:o,alternate:s,esmExports:r,peers:a}=q(t),c=b(i,o,s,r,a,L(e.project,i)),l=o&&v(e.project,t,i,o,!0),p=s&&v(e.project,t,i,s,!1);return{...t,version:`0.0.0-condition-${c}`,languageName:e.project.configuration.get("defaultLanguageName"),linkType:N.LinkType.HARD,dependencies:new Map([o&&[l.identHash,l],s&&[p.identHash,p]].filter(Boolean)),peerDependencies:new Map((a||[]).map(d=>{let u=N.structUtils.parseDescriptor(`${d}@*`);return[u.identHash,u]})),dependenciesMeta:new Map,peerDependenciesMeta:new Map,bin:null}}};var V=g("@yarnpkg/core");var Z=g("@yarnpkg/core"),$=g("@yarnpkg/fslib"),W=g("@yarnpkg/libzip"),G=15805116e5;async function X(n,t,e,i,o){let[s,r]=await Promise.all([$.xfs.mktempPromise(),(0,W.getLibzipPromise)()]),a=$.ppath.join(s,"condition.zip"),c=Z.structUtils.getIdentVendorPath(n),l=new W.ZipFS(a,{libzip:r,create:!0,level:t.configuration.get("compressionLevel")});return await l.mkdirpPromise(c),await Promise.all([l.writeJsonPromise($.ppath.join(c,"package.json"),e),l.writeFilePromise($.ppath.join(c,"index.js"),i),o&&l.writeFilePromise($.ppath.join(c,"index.mjs"),o)]),await Promise.all(l.getAllFiles().map(p=>l.utimesPromise(p,G,G))),l}var _=class{supports(t){return k(t.reference)}getLocalPath(){return null}async fetch(t,e){let i=e.checksums.get(t.locatorHash)||null,[o,s,r]=await e.cache.fetchPackageFromCache(t,i,{onHit:()=>e.report.reportCacheHit(t),onMiss:()=>e.report.reportCacheMiss(t,`${V.structUtils.prettyLocator(e.project.configuration,t)} can't be found in the cache and will be fetched from the disk`),loader:()=>this.generateConditionPackage(t,e),skipIntegrityCheck:e.skipIntegrityCheck});return{packageFs:o,releaseFs:s,prefixPath:V.structUtils.getIdentVendorPath(t),localPath:this.getLocalPath(),checksum:r}}async generateConditionPackage(t,e){let{test:i,consequent:o,alternate:s,esmExports:r,peers:a}=q(t),c=L(e.project,i),l=b(i,o,s,r,a,c),p=(P,U)=>{if(P==null)return{dependency:null,require:"null",esmHeader:"",imported:"{ __proto__: null }"};let D=v(e.project,t,i,P,U),A=V.structUtils.stringifyIdent(D),Y=`if_${U}`;return{dependency:{[A]:D.range},require:`require(${JSON.stringify(A)})`,esmHeader:`import * as ${Y} from ${JSON.stringify(A)};`,imported:Y}},d=p(o,!0),u=p(s,!1),C={version:`0.0.0-condition-${l}`,dependencies:{...d.dependency,...u.dependency},...r&&{exports:{require:"./index.js",default:"./index.mjs"}},...a&&{peerDependencies:Object.fromEntries(a.map(P=>[P,"*"]))}},f=`// env vars from the cli are always strings, so !!ENV_VAR returns true for "false"
function bool(value) {
  if (value == null) return ${c};
  return value && value !== "false" && value !== "0";
}
`,m=`${f}
module.exports = bool(process.env[${JSON.stringify(i)}])
  ? ${d.require}
  : ${u.require};
`,y=null;if(r){m+=`0 && (${r.map(D=>`exports.${D} = `).join("")} 0);`;let P=!1,U=[];for(let D of r)D==="default"?P=!0:U.push(D);y=`${f}
${d.esmHeader}
${u.esmHeader}

export const { ${U.join(", ")} } = bool(process.env[${JSON.stringify(i)}]) ? ${d.imported} : ${u.imported};
${P&&`export default (bool(process.env[${JSON.stringify(i)}]) ? ${d.imported} : ${u.imported}).default;`}
`}return X(t,e.project,C,m,y)}};var J=g("@yarnpkg/core");var ge=Function.call.bind(Object.prototype.hasOwnProperty);async function ee(n,t){let{project:e}=n,i=!1;for(let o of S){let s=n.manifest.getForScope(o).values();for(let r of s){if(!k(r.range))continue;let{test:a,consequent:c,alternate:l}=j(r),p=R(e,a)?c:l,d=J.structUtils.stringifyIdent(r),u=o==="dependencies"&&!t.dependencies[d]&&t.optionalDependencies?.[d]?"optionalDependencies":o;p?(t[u][d]=p,n.manifest.raw[u][d]=p,n.manifest[o].set(r.identHash,J.structUtils.makeDescriptor(r,p))):(delete t[u][d],delete n.manifest.raw[u][d],n.manifest[o].delete(r.identHash)),i=!0}}if(ge(t,"conditions")){i=!0;let o=t.conditions;for(let[s,[r,a]]of Object.entries(o)){let c=R(e,s)?r:a;if(c)for(let[l,p]of Object.entries(c))p===null?delete t[l]:t[l]=p}delete t.conditions}i&&await n.project.configuration.triggerHook(o=>o.beforeWorkspacePacking,n,t)}var h=g("@yarnpkg/core"),te=g("@yarnpkg/cli"),w=g("clipanion"),ne=pe(g("typanion"));var he=Function.call.bind(Object.prototype.hasOwnProperty),oe=(n,t,...e)=>he(n,t)&&(e.length===0||oe(n[t],...e)),E=class extends te.BaseCommand{constructor(){super(...arguments);this.condition=w.Option.String({required:!0});this.true=w.Option.Boolean("--true",!1);this.false=w.Option.Boolean("--false",!1)}async execute(){let{project:e,workspace:i,cache:o,configuration:s}=await this.getRoot();T(e,this.condition);let r=this.false?!1:this.true?!0:R(e,this.condition);for(let c of this.nestedWorkspaces(i,e))this.materializeCondition(r,c);let a=await h.StreamReport.start({configuration:s,stdout:this.context.stdout,includeLogs:!0},async c=>{await e.resolveEverything({cache:o,report:c})});if(a.hasErrors())return a.exitCode();await e.persist()}*nestedWorkspaces(e,i){yield e;for(let o of e.workspacesCwds){let s=i.workspacesByCwd.get(o);s&&(yield*this.nestedWorkspaces(s,i))}}materializeCondition(e,i){for(let s of S){let r=i.manifest.getForScope(s).values();for(let a of r){if(!k(a.range))continue;let{test:c,consequent:l,alternate:p}=j(a);if(c!==this.condition)continue;let d=e?l:p;d?i.manifest[s].set(a.identHash,h.structUtils.makeDescriptor(a,d)):i.manifest[s].delete(a.identHash)}}let o=i.manifest.raw;if(oe(o,"conditions",this.condition)){let[s,r]=o.conditions[this.condition],a=e?s:r;if(a)for(let[c,l]of Object.entries(a))l===null?delete o[c]:o[c]=l;Object.keys(o.conditions).length===1?delete o.conditions:delete o.conditions[this.condition]}}async getRoot(){let e=await h.Configuration.find(this.context.cwd,this.context.plugins),[{project:i,workspace:o},s]=await Promise.all([h.Project.find(e,this.context.cwd),h.Cache.find(e,{immutable:!0})]);return{configuration:e,project:i,workspace:o,cache:s}}};E.paths=[["condition","materialize"]],E.usage=w.Command.Usage({description:"Evaluate and replace a condition in package.json files",details:"\n      This command will replace all the occurrences of `<condition>` in the current workspace and in nested workspaces.\n\n      The value of the condition (`true` or `false`) is based on the following sources, in descending priority order:\n\n      - the `--true` or `--false` option;\n      - the `<condition>` environment variable;\n      - the default value specified in the Yarn configuration;\n      - `false` by default.\n    "}),E.schema=[ne.hasMutuallyExclusiveKeys(["true","false"])];var ye={configuration:K,commands:[E],fetchers:[_],resolvers:[I],hooks:{beforeWorkspacePacking:ee}};return de(ke);})();
return plugin;
}
};
