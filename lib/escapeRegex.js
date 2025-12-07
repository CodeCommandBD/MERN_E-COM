/**
 * Escape special regex characters to prevent ReDoS attacks
 * @param {string} str - User input string
 * @returns {string} - Escaped string safe for use in $regex
 */
export const escapeRegex = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
