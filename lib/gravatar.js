import crypto from "crypto";

/**
 * Generate Gravatar URL from email
 * @param {string} email - User's email address
 * @param {number} size - Avatar size (default: 200)
 * @param {string} defaultImage - Default image type (default: 'identicon')
 * @returns {string} Gravatar URL
 */
export function getGravatarUrl(email, size = 200, defaultImage = "identicon") {
  if (!email) return "";

  // Normalize email: trim and lowercase
  const normalizedEmail = email.trim().toLowerCase();

  // Create MD5 hash
  const hash = crypto.createHash("md5").update(normalizedEmail).digest("hex");

  // Return Gravatar URL
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
}
