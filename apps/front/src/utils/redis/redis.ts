import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { supabase } from '@/utils/supabase/client'

// Create rate limiter using direct Redis connection for API rate limiting
const REDIS_URL = import.meta.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = import.meta.env.UPSTASH_REDIS_REST_TOKEN

if (!REDIS_URL || !REDIS_TOKEN) {
    console.warn('Redis credentials not found, rate limiting will be disabled')
}

// Create Redis client for rate limiting only
const redis = REDIS_URL && REDIS_TOKEN ? new Redis({
    url: REDIS_URL.startsWith('https://') ? REDIS_URL : `https://${REDIS_URL}`,
    token: REDIS_TOKEN,
}) : null

// Create rate limiter if Redis is available
export const rateLimiter = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
    prefix: '@lomi/api',
}) : null

// Helper function to check rate limit
export async function checkRateLimit(identifier: string) {
    try {
        if (!rateLimiter) {
            return {
                success: true,
                limit: 10,
                reset: 10,
                remaining: 10,
                headers: {}
            }
        }

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

// Cache implementation using Edge Function
async function invokeFunction(method: 'GET' | 'SET' | 'DELETE', userId: string, organizationId: string | null, data?: unknown) {
    try {
        const { data: response, error } = await supabase.functions.invoke('sidebar-cache', {
            body: {
                method,
                userId,
                organizationId: organizationId || 'default',
                data
            }
        })

        if (error) {
            console.error('Cache function error:', error)
            return null
        }

        return response
    } catch (error) {
        console.error('Cache invocation error:', error)
        return null
    }
}

export const cache = {
    async get<T>(key: string): Promise<T | null> {
        try {
            // Extract userId and organizationId from the key
            const parts = key.split(':')
            if (parts.length < 2) {
                console.error('Invalid cache key format')
                return null
            }

            // We can safely assert these types because we checked parts.length >= 2
            const userId = parts[1] as string
            const organizationId = parts.length > 2 ? parts[2] as string : null

            const response = await invokeFunction('GET', userId, organizationId)
            return response?.data || null
        } catch (error) {
            console.error('Redis get error:', error)
            return null
        }
    },

    async set(key: string, value: unknown): Promise<boolean> {
        try {
            // Extract userId and organizationId from the key
            const parts = key.split(':')
            if (parts.length < 2) {
                console.error('Invalid cache key format')
                return false
            }

            // We can safely assert these types because we checked parts.length >= 2
            const userId = parts[1] as string
            const organizationId = parts.length > 2 ? parts[2] as string : null

            const response = await invokeFunction('SET', userId, organizationId, value)
            return response?.success || false
        } catch (error) {
            console.error('Redis set error:', error)
            return false
        }
    },

    async del(key: string): Promise<boolean> {
        try {
            // Extract userId and organizationId from the key
            const parts = key.split(':')
            if (parts.length < 2) {
                console.error('Invalid cache key format')
                return false
            }

            // We can safely assert these types because we checked parts.length >= 2
            const userId = parts[1] as string
            const organizationId = parts.length > 2 ? parts[2] as string : null

            const response = await invokeFunction('DELETE', userId, organizationId)
            return response?.success || false
        } catch (error) {
            console.error('Redis delete error:', error)
            return false
        }
    }
} 