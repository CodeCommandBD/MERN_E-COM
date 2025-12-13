/**
 * Production-ready rate limiter with Redis support
 * Features:
 * - Redis-based storage (persists across restarts)
 * - Automatic fallback to in-memory for development
 * - Shared across multiple server instances
 * - TTL-based automatic cleanup
 */

import { createClient } from 'redis';

// Redis client (lazy initialization)
let redisClient = null;
let redisAvailable = false;

// Fallback in-memory store for development
const memoryStore = new Map();

/**
 * Initialize Redis connection
 */
async function initRedis() {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;
  
  if (!redisUrl) {
    console.warn('⚠️  REDIS_URL not configured. Using in-memory rate limiting (not production-safe)');
    redisAvailable = false;
    return null;
  }

  try {
    redisClient = createClient({ url: redisUrl });
    
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
      redisAvailable = false;
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected for rate limiting');
      redisAvailable = true;
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    redisAvailable = false;
    return null;
  }
}

/**
 * Check if request should be rate limited
 * @param {string} identifier - Unique identifier (IP address or user ID)
 * @param {number} limit - Max requests per window (default: 10)
 * @param {number} windowMs - Time window in ms (default: 60000 = 1 minute)
 * @returns {Promise<object>} - { allowed: boolean, remaining: number, resetIn: number }
 */
export const checkRateLimit = async (identifier, limit = 10, windowMs = 60000) => {
  if (process.env.NODE_ENV !== "production") {
    return { allowed: true, remaining: limit, resetIn: 0 };
  }

  if (
    identifier.includes("127.0.0.1") ||
    identifier.includes("::1") ||
    identifier.includes("localhost")
  ) {
    return { allowed: true, remaining: limit, resetIn: 0 };
  }

  if (!redisClient && process.env.REDIS_URL) {
    await initRedis();
  }

  if (redisAvailable && redisClient) {
    return checkRateLimitRedis(identifier, limit, windowMs);
  }

  return checkRateLimitMemory(identifier, limit, windowMs);
};

/**
 * Redis-based rate limiting (production)
 */
async function checkRateLimitRedis(identifier, limit, windowMs) {
  try {
    const key = `ratelimit:${identifier}`;
    const now = Date.now();

    // Get current count
    const count = await redisClient.get(key);

    if (!count) {
      // First request - set with TTL
      await redisClient.set(key, '1', { PX: windowMs });
      return { allowed: true, remaining: limit - 1, resetIn: windowMs };
    }

    const currentCount = parseInt(count);

    if (currentCount >= limit) {
      // Rate limit exceeded
      const ttl = await redisClient.pTTL(key);
      return { allowed: false, remaining: 0, resetIn: ttl > 0 ? ttl : 0 };
    }

    // Increment count
    await redisClient.incr(key);
    const ttl = await redisClient.pTTL(key);

    return {
      allowed: true,
      remaining: limit - currentCount - 1,
      resetIn: ttl > 0 ? ttl : windowMs,
    };
  } catch (error) {
    console.error('Redis rate limit error, falling back to memory:', error);
    redisAvailable = false;
    return checkRateLimitMemory(identifier, limit, windowMs);
  }
}

/**
 * In-memory rate limiting (development fallback)
 */
function checkRateLimitMemory(identifier, limit, windowMs) {
  const now = Date.now();
  const key = identifier;

  const data = memoryStore.get(key);

  if (!data || now - data.timestamp > windowMs) {
    // First request or window expired
    memoryStore.set(key, { count: 1, timestamp: now });
    return { allowed: true, remaining: limit - 1, resetIn: windowMs };
  }

  if (data.count >= limit) {
    // Rate limit exceeded
    const resetIn = windowMs - (now - data.timestamp);
    return { allowed: false, remaining: 0, resetIn };
  }

  // Increment count
  data.count++;
  memoryStore.set(key, data);
  return {
    allowed: true,
    remaining: limit - data.count,
    resetIn: windowMs - (now - data.timestamp),
  };
}

// Cleanup in-memory entries every 5 minutes (only for fallback)
setInterval(() => {
  if (!redisAvailable) {
    const now = Date.now();
    for (const [key, data] of memoryStore.entries()) {
      if (now - data.timestamp > 60000) {
        memoryStore.delete(key);
      }
    }
  }
}, 300000);

/**
 * Get client IP from request headers
 * @param {Request} request - Next.js request object
 * @returns {string} - Client IP address
 */
export const getClientIP = (request) => {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfIP = request.headers.get("cf-connecting-ip");
  const host = request.headers.get("host");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (cfIP) {
    return cfIP;
  }

  if (host && (host.includes("localhost") || host.startsWith("127.0.0.1"))) {
    return "127.0.0.1";
  }

  if (process.env.NODE_ENV !== "production") {
    return "127.0.0.1";
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

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGTERM', async () => {
    if (redisClient) {
      await redisClient.quit();
    }
  });
}
