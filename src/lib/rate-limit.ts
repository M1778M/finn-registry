import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (c: Context) => string | Promise<string>;
}

const store = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (config: RateLimitConfig) => {
  return async (c: Context, next: Next) => {
    // Default key is IP + Path, but can be overridden (e.g. for user-based limits)
    let key = "";
    if (config.keyGenerator) {
      key = await config.keyGenerator(c);
    } else {
      const ip = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "anonymous";
      const path = c.req.path;
      key = `${ip}:${path}`;
    }

    const now = Date.now();
    let record = store.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + config.windowMs
      };
    }

    record.count++;
    store.set(key, record);

    const remaining = Math.max(0, config.max - record.count);
    const reset = Math.ceil(record.resetTime / 1000);

    c.header("X-RateLimit-Limit", config.max.toString());
    c.header("X-RateLimit-Remaining", remaining.toString());
    c.header("X-RateLimit-Reset", reset.toString());

    if (record.count > config.max) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      c.header("Retry-After", retryAfter.toString());

      return c.json({
        error: "Too many requests",
        message: config.message || "You have exceeded the rate limit for this action. Please try again later.",
        retryAfter,
        limit: config.max,
        remaining: 0,
        reset
      }, 429);
    }

    await next();
  };
};

// Cleanup expired records
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key);
    }
  }
}, 30000); // Clean up every 30 seconds
