/**
 * Shared API Response Cache Headers
 * Use these constants for consistent caching across API routes
 */

// For high-traffic, cacheable data (products, categories, reviews)
export const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

// For data that should not be cached (user-specific, checkout, auth)
export const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

// For static/rarely changing data (settings, configs)
export const LONG_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

/**
 * Helper to create Response with cache headers
 * @param {Object} data - Response data
 * @param {Object} options - Options including status and cache type
 * @returns {Response}
 */
export function createCachedResponse(
  data,
  { status = 200, cache = "default" } = {}
) {
  const headers = {
    "Content-Type": "application/json",
    ...(cache === "none"
      ? NO_CACHE_HEADERS
      : cache === "long"
      ? LONG_CACHE_HEADERS
      : CACHE_HEADERS),
  };

  return new Response(JSON.stringify(data), { status, headers });
}

/**
 * Helper to create error Response (no cache)
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @returns {Response}
 */
export function createErrorResponse(message, status = 500) {
  return new Response(JSON.stringify({ success: false, message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...NO_CACHE_HEADERS,
    },
  });
}
