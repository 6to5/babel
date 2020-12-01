import { NODE_FIELDS, NODE_PARENT_VALIDATIONS } from "../definitions";

export default function validate(
  node: any | undefined | null,
  key: string,
  val: any,
): void {
  if (!node) return;

  const fields = NODE_FIELDS[node.type];
  if (!fields) return;

  const field = fields[key];
  validateField(node, key, val, field);
  validateChild(node, key, val);
}

export function validateField(
  node: any | undefined | null,
  key: string,
  val: any,
  field: any,
): void {
  if (!field?.validate) return;
  if (field.optional && val == null) return;

  field.validate(node, key, val);
}

export function validateChild(
  node: any | undefined | null,
  key: string,
  val?: any,
) {
  if (val == null) return;
  const validate = NODE_PARENT_VALIDATIONS[val.type];
  if (!validate) return;
  validate(node, key, val);
}
