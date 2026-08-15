export function validateLayoutDocumentV1(document, options = {}) {
  if (!document || typeof document !== "object") {
    return { valid: false, errors: ["Invalid layout document object"] };
  }
  if (!Array.isArray(document.blocks)) {
    return { valid: false, errors: ["Layout blocks must be an array"] };
  }
  return { valid: true, errors: [] };
}

export function assertValidLayoutDocumentV1(document, options = {}) {
  const result = validateLayoutDocumentV1(document, options);
  if (!result.valid) {
    throw new Error(`Invalid layout document: ${result.errors.join(", ")}`);
  }
  return true;
}

export default {
  validateLayoutDocumentV1,
  assertValidLayoutDocumentV1,
};
