import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

const REDIS_URL = import.meta.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = import.meta.env.UPSTASH_REDIS_REST_TOKEN

if (!REDIS_URL) {
    throw new Error('UPSTASH_REDIS_REST_URL is not defined')
}

if (!REDIS_TOKEN) {
    throw new Error('UPSTASH_REDIS_REST_TOKEN is not defined')
}

// Create Redis client
export const redis = new Redis({
    url: REDIS_URL.startsWith('https://') ? REDIS_URL : `https://${REDIS_URL}`,
    token: REDIS_TOKEN,
})

// Create rate limiter
export const rateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
    prefix: '@lomi/api',
})

// Helper function to check rate limit
export async function checkRateLimit(identifier: string) {
    try {
        const { success, limit, reset, remaining } = await rateLimiter.limit(identifier)
        return {
            success,
            limit,
            reset,
            remaining,
            headers: {
                'X-RateLimit-Limit': limit.toString(),
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': reset.toString()
            }
        }
    } catch (error) {
        console.error('Rate limit check error:', error)
        // Default to allowing the request if rate limiting fails
        return {
            success: true,
            limit: 10,
            reset: 10,
            remaining: 10,
            headers: {}
        }
    }
}

// Export a simple wrapper for common cache operations
export const cache = {
    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await redis.get(key);
            return data ? JSON.parse(data as string) : null;
        } catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    },

    async set(key: string, value: unknown, expirationInSeconds?: number) {
        try {
            if (expirationInSeconds) {
                await redis.set(key, JSON.stringify(value), { ex: expirationInSeconds });
            } else {
                await redis.set(key, JSON.stringify(value));
            }
            return true;
        } catch (error) {
            console.error('Redis set error:', error);
            return false;
        }
    },

    async del(key: string) {
        try {
            await redis.del(key);
            return true;
        } catch (error) {
            console.error('Redis delete error:', error);
            return false;
        }
    }
} 