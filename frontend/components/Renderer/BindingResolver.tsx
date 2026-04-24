/**
 * BindingResolver
 * Replaces {{ key.path }} placeholders in a template string with actual values from a data object.
 */
export function BindingResolver(template: string, data: any): string {
  if (!template) return '';
  if (!data) return template;

  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, path) => {
    const keys = path.split('.');
    let value = data;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return match; // If data not found, leave the placeholder
      }
    }
    // Return stringified value or empty if undefined
    return value !== undefined && value !== null ? String(value) : '';
  });
}
