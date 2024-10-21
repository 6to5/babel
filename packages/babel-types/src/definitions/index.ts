import "./core.ts";
import "./flow.ts";
import "./jsx.ts";
import "./misc.ts";
import "./experimental.ts";
import "./typescript.ts";
import {
  VISITOR_KEYS,
  ALIAS_KEYS,
  FLIPPED_ALIAS_KEYS,
  NODE_FIELDS,
  BUILDER_KEYS,
  DEPRECATED_KEYS,
  NODE_PARENT_VALIDATIONS,
  allExpandedTypes,
} from "./utils.ts";
import {
  PLACEHOLDERS,
  PLACEHOLDERS_ALIAS,
  PLACEHOLDERS_FLIPPED_ALIAS,
} from "./placeholders.ts";
import { DEPRECATED_ALIASES } from "./deprecated-aliases.ts";

(
  Object.keys(DEPRECATED_ALIASES) as (keyof typeof DEPRECATED_ALIASES)[]
).forEach(deprecatedAlias => {
  FLIPPED_ALIAS_KEYS[deprecatedAlias] =
    FLIPPED_ALIAS_KEYS[DEPRECATED_ALIASES[deprecatedAlias]];
});

for (const { types, set } of allExpandedTypes) {
  for (const type of types) {
    const aliases = FLIPPED_ALIAS_KEYS[type];
    if (aliases) {
      aliases.forEach(set.add, set);
    } else {
      set.add(type);
    }
  }
}

// We do this here, because at this point the visitor keys should be ready and setup
// `%ToFastProperties` no longer improves performance, so we use another approach.
const _VISITOR_KEYS = { ...VISITOR_KEYS };
const _ALIAS_KEYS = { ...ALIAS_KEYS };
const _FLIPPED_ALIAS_KEYS = { ...FLIPPED_ALIAS_KEYS };
const _NODE_FIELDS = { ...NODE_FIELDS };
const _BUILDER_KEYS = { ...BUILDER_KEYS };
const _DEPRECATED_KEYS = { ...DEPRECATED_KEYS };
const _NODE_PARENT_VALIDATIONS = { ...NODE_PARENT_VALIDATIONS };

const _PLACEHOLDERS_ALIAS = { ...PLACEHOLDERS_ALIAS };
const _PLACEHOLDERS_FLIPPED_ALIAS = { ...PLACEHOLDERS_FLIPPED_ALIAS };

const TYPES: Array<string> = [].concat(
  Object.keys(VISITOR_KEYS),
  Object.keys(FLIPPED_ALIAS_KEYS),
  Object.keys(DEPRECATED_KEYS),
);

export {
  _VISITOR_KEYS as VISITOR_KEYS,
  _ALIAS_KEYS as ALIAS_KEYS,
  _FLIPPED_ALIAS_KEYS as FLIPPED_ALIAS_KEYS,
  _NODE_FIELDS as NODE_FIELDS,
  _BUILDER_KEYS as BUILDER_KEYS,
  DEPRECATED_ALIASES,
  _DEPRECATED_KEYS as DEPRECATED_KEYS,
  _NODE_PARENT_VALIDATIONS as NODE_PARENT_VALIDATIONS,
  PLACEHOLDERS,
  _PLACEHOLDERS_ALIAS as PLACEHOLDERS_ALIAS,
  _PLACEHOLDERS_FLIPPED_ALIAS as PLACEHOLDERS_FLIPPED_ALIAS,
  TYPES,
};

export type { FieldOptions } from "./utils.ts";
