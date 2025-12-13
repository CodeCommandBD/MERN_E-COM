# Redis Rate Limiting Setup

## 🚨 Critical Security Enhancement

This project now uses **Redis-based rate limiting** to prevent brute force attacks and API abuse. The rate limiter:

- ✅ **Persists across server restarts** (no more reset on deployment)
- ✅ **Works with horizontal scaling** (shared across multiple instances)
- ✅ **Production-ready** with automatic fallback
- ✅ **TTL-based cleanup** (no manual maintenance)

## Quick Start

### Development (Local Redis)

1. **Install Redis locally:**
   ```bash
   # Windows (using Chocolatey)
   choco install redis-64

   # macOS
   brew install redis
   brew services start redis

   # Linux
   sudo apt-get install redis-server
   sudo systemctl start redis

   # Docker (easiest for all platforms)
   docker run -d -p 6379:6379 redis:alpine
   ```

2. **Add to `.env.local`:**
   ```bash
   REDIS_URL=redis://localhost:6379
   ```

3. **Restart your dev server:**
   ```bash
   pnpm run dev
   ```

### Production (Upstash Redis - Recommended for Vercel)

1. **Sign up for free:** https://upstash.com

2. **Create Redis database:**
   - Click "Create Database"
   - Select region closest to your users
   - Choose "TLS enabled"

3. **Copy connection string:**
   - In Upstash dashboard → "Redis Connect" → "Node"
   - Copy the REDIS_URL

4. **Add to Vercel Environment Variables:**
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - Name: `REDIS_URL`
   - Value: `rediss://default:YOUR_PASSWORD@YOUR_REDIS.upstash.io:6379`
   - Apply to: Production, Preview, Development

5. **Deploy:**
   ```bash
   vercel --prod
   ```

### Alternative: Vercel KV (Vercel Platform Only)

If deploying on Vercel, you can use built-in KV storage:

1. Vercel Dashboard → Project → Storage → Create Database → KV
2. Environment variable `UPSTASH_REDIS_REST_URL` will be auto-configured
3. No additional setup needed!

## Testing Rate Limits

### Test Locally

```bash
# Test login rate limit (5 attempts per minute)
for i in {1..10}; do
  echo "Request $i"
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo ""
done

# Expected:
# - Requests 1-5: Normal responses
# - Request 6+: 429 Too Many Requests
```

### Verify Redis Connection

```bash
# Check server logs for:
✅ Redis connected for rate limiting

# If you see:
⚠️  REDIS_URL not configured. Using in-memory rate limiting
# → Add REDIS_URL to .env.local
```

## Current Rate Limits

| Endpoint | Method | Limit | Window |
|----------|--------|-------|--------|
| `/api/auth/login` | POST | 5 requests | 1 minute |
| `/api/auth/register` | POST | 3 requests | 1 hour |
| `/api/auth/verify-otp` | POST | 5 requests | 1 minute |

## Troubleshooting

### "REDIS_URL not configured" warning

**Solution:** Add `REDIS_URL` to your `.env.local` file:
```bash
REDIS_URL=redis://localhost:6379
```

### "Connection refused" error

**Local development:**
- Make sure Redis is running: `redis-cli ping` (should return "PONG")
- Check Docker container: `docker ps` (should see redis container)

**Production:**
- Verify Upstash Redis URL is correct
- Check firewall settings allow connections
- Ensure TLS is enabled for Upstash (use `rediss://` not `redis://`)

### Rate limits not persisting

- Check Redis connection logs
- Verify `REDIS_URL` environment variable is set
- Restart application after adding env var

## Cost

- **Development:** Free (local Redis or Docker)
- **Upstash Free Tier:** 10,000 commands/day (sufficient for small apps)
- **Upstash Pro:** $0.2 per 100K commands
- **Vercel KV:** Included in Pro plan

## Security Benefits

✅ **Before:** Rate limits reset on server restart → attackers could bypass by forcing restarts  
✅ **After:** Rate limits persist in Redis → consistent protection 24/7

✅ **Before:** Not shared across instances → attackers could hit multiple servers  
✅ **After:** Centralized Redis → all instances share rate limit data

✅ **Before:** In-memory Map() → memory leak over time  
✅ **After:** TTL-based expiry → automatic cleanup

## Need Help?

- **Redis Docs:** https://redis.io/docs/
- **Upstash Docs:** https://docs.upstash.com/redis
- **Vercel KV:** https://vercel.com/docs/storage/vercel-kv
