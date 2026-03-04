/**
 * Lightweight in-memory rate limiter.
 *
 * Suitable for single-instance servers (local dev, single-node deployments).
 * For multi-instance / serverless, swap the Map for a Redis-backed store
 * (e.g. @upstash/ratelimit with Vercel KV).
 */

interface Entry {
  count:   number
  resetAt: number
}

const store = new Map<string, Entry>()

// Prune expired entries every 5 minutes to avoid unbounded memory growth
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 5 * 60 * 1_000)

export interface RateLimitResult {
  allowed:   boolean
  remaining: number
  resetAt:   number   // Unix ms timestamp when the window resets
}

/**
 * Check (and record) a single attempt against a named rate-limit bucket.
 *
 * @param key       Unique identifier — e.g. `"login:${ip}"` or `"mfa:${email}"`
 * @param limit     Maximum allowed attempts in the window
 * @param windowMs  Window duration in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now   = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: limit - 1, resetAt }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}

/** Convenience: build a 429 response body with a Retry-After header. */
export function rateLimitResponse(resetAt: number): Response {
  const retryAfterSec = Math.ceil((resetAt - Date.now()) / 1_000)
  return new Response(
    JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }),
    {
      status: 429,
      headers: {
        'Content-Type':  'application/json',
        'Retry-After':   String(retryAfterSec),
        'X-RateLimit-Reset': String(resetAt),
      },
    },
  )
}
