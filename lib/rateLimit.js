/**
 * Simple in-memory rate limiter for API routes
 * Uses LRU cache to track request counts per IP
 */

// Simple in-memory store (resets on server restart)
const requestCounts = new Map();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now - data.timestamp > 60000) {
      requestCounts.delete(key);
    }
  }
}, 300000);

/**
 * Check if request should be rate limited
 * @param {string} identifier - Unique identifier (IP address or user ID)
 * @param {number} limit - Max requests per window (default: 10)
 * @param {number} windowMs - Time window in ms (default: 60000 = 1 minute)
 * @returns {object} - { allowed: boolean, remaining: number, resetIn: number }
 */
export const checkRateLimit = (identifier, limit = 10, windowMs = 60000) => {
  const now = Date.now();
  const key = identifier;

  const data = requestCounts.get(key);

  if (!data || now - data.timestamp > windowMs) {
    // First request or window expired
    requestCounts.set(key, { count: 1, timestamp: now });
    return { allowed: true, remaining: limit - 1, resetIn: windowMs };
  }

  if (data.count >= limit) {
    // Rate limit exceeded
    const resetIn = windowMs - (now - data.timestamp);
    return { allowed: false, remaining: 0, resetIn };
  }

  // Increment count
  data.count++;
  requestCounts.set(key, data);
  return {
    allowed: true,
    remaining: limit - data.count,
    resetIn: windowMs - (now - data.timestamp),
  };
};

/**
 * Get client IP from request headers
 * @param {Request} request - Next.js request object
 * @returns {string} - Client IP address
 */
export const getClientIP = (request) => {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
};

/**
 * Rate limit response helper
 * @param {number} resetIn - Time until reset in ms
 * @returns {Response} - 429 Too Many Requests response
 */
export const rateLimitResponse = (resetIn) => {
  return new Response(
    JSON.stringify({
      success: false,
      message: "Too many requests. Please try again later.",
      retryAfter: Math.ceil(resetIn / 1000),
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.ceil(resetIn / 1000)),
      },
    }
  );
};
