/**
 * Lightweight, zero-dependency syntax tokenizer for Code Block rendering.
 * Supports javascript/typescript, python, html, css, json, bash, sql.
 */

export interface HighlightToken {
  text: string;
  color?: string;
}

const JS_KEYWORDS = new Set([
  "async", "await", "break", "case", "catch", "class", "const", "continue",
  "debugger", "default", "delete", "do", "else", "export", "extends", "false",
  "finally", "for", "from", "function", "if", "import", "in", "instanceof",
  "interface", "let", "new", "null", "of", "return", "static", "super",
  "switch", "this", "throw", "true", "try", "type", "typeof", "undefined",
  "var", "void", "while", "with", "yield",
]);

const PY_KEYWORDS = new Set([
  "and", "as", "assert", "async", "await", "break", "class", "continue",
  "def", "del", "elif", "else", "except", "False", "finally", "for", "from",
  "global", "if", "import", "in", "is", "lambda", "None", "nonlocal", "not",
  "or", "pass", "raise", "return", "True", "try", "while", "with", "yield",
]);

const SQL_KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET",
  "DELETE", "CREATE", "TABLE", "ALTER", "DROP", "JOIN", "INNER", "LEFT",
  "RIGHT", "ON", "AND", "OR", "NOT", "NULL", "AS", "ORDER", "BY", "GROUP",
  "HAVING", "LIMIT", "OFFSET", "ASC", "DESC", "PRIMARY", "KEY", "INDEX",
]);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Tokenizes source code into safe HTML with VS Code Dark+ inspired inline colors.
 */
export function highlightCodeToHtml(code: string, language = "javascript"): string {
  const source = String(code ?? "");
  const lang = String(language || "javascript").toLowerCase();

  if (!source) return "";

  const keywords =
    lang === "python" || lang === "py"
      ? PY_KEYWORDS
      : lang === "sql"
        ? SQL_KEYWORDS
        : JS_KEYWORDS;

  // Match comments, strings, numbers, tags, or identifiers
  const tokenRegex =
    lang === "python" || lang === "py" || lang === "bash" || lang === "sh"
      ? /(#[^\n]*|"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b)/g
      : lang === "html" || lang === "xml"
        ? /(<!--[\s\S]*?-->|<\/?[A-Za-z0-9-]+|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[A-Za-z-]+(?==))/g
        : /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][A-Za-z0-9_$]*\b)/g;

  let result = "";
  let lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = tokenRegex.exec(source)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(source.slice(lastIndex, match.index));
    }

    const token = match[0];
    const escaped = escapeHtml(token);

    if (
      token.startsWith("//") ||
      token.startsWith("/*") ||
      token.startsWith("#") ||
      token.startsWith("<!--")
    ) {
      result += `<span style="color:#6A9955;font-style:italic">${escaped}</span>`;
    } else if (
      token.startsWith('"') ||
      token.startsWith("'") ||
      token.startsWith("`")
    ) {
      result += `<span style="color:#CE9178">${escaped}</span>`;
    } else if (token.startsWith("<")) {
      result += `<span style="color:#569CD6">${escaped}</span>`;
    } else if (/^\d/.test(token)) {
      result += `<span style="color:#B5CEA8">${escaped}</span>`;
    } else if (
      keywords.has(token) ||
      (lang === "sql" && keywords.has(token.toUpperCase()))
    ) {
      result += `<span style="color:#C586C0;font-weight:600">${escaped}</span>`;
    } else if (
      source[tokenRegex.lastIndex] === "(" ||
      /^[A-Z]/.test(token)
    ) {
      result += `<span style="color:#DCDCAA">${escaped}</span>`;
    } else {
      result += escaped;
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < source.length) {
    result += escapeHtml(source.slice(lastIndex));
  }

  return result;
}
