import { Request, Response, NextFunction } from 'express'
import { checkRateLimit } from '@/utils/redis/redis'

export async function rateLimitMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> {
    try {
        // Use IP address as identifier, or API key if available
        const apiKey = req.headers['x-api-key']
        const identifier = (typeof apiKey === 'string' ? apiKey : req.ip) || 'anonymous'
        
        const { success, headers } = await checkRateLimit(identifier)

        // Add rate limit headers to response
        res.set(headers)

        if (!success) {
            return res.status(429).json({
                code: 'TOO_MANY_REQUESTS',
                message: 'Too many requests. Please try again later.',
            })
        }

        next()
    } catch (error) {
        console.error('Rate limit error:', error)
        next() // Continue on error to prevent API from breaking
    }
} 