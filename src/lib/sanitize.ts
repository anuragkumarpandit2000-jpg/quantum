/**
 * Input sanitization helpers to prevent XSS, HTML injection, and control character abuse.
 */

const HTML_ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

/**
 * Escapes unsafe HTML characters into safe HTML entities
 */
export function escapeHtml(str: string): string {
  if (typeof str !== "string") return "";
  return str.replace(/[&<>"'/]/g, (match) => HTML_ENTITY_MAP[match] || match);
}

/**
 * Strips script tags, HTML tags, and harmful control characters from untrusted user input
 */
export function sanitizePlainText(input: unknown, maxLength = 2000): string {
  if (typeof input !== "string") return "";
  let cleaned = input
    // Remove null bytes and invisible control chars
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove all HTML tags
    .replace(/<[^>]+>/g, "")
    .trim();

  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength);
  }

  return cleaned;
}

/**
 * Validates password strength (minimum 8 characters, at least one letter and one number)
 */
export function validatePasswordStrength(password: string): { isValid: boolean; error?: string } {
  if (typeof password !== "string" || password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long." };
  }
  if (password.length > 128) {
    return { isValid: false, error: "Password cannot exceed 128 characters." };
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      error: "Password must contain both letters and at least one number.",
    };
  }

  return { isValid: true };
}
