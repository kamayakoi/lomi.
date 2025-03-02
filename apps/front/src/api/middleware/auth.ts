import { Request, Response, NextFunction } from 'express';
import { supabase } from '@/utils/supabase/client';
import { AuthenticatedRequest, ValidateApiKeyResponse, SupabaseRPCResponse } from './types';

export async function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'API key is missing',
    });
  }

  try {
    // Use the RPC function to validate the API key
    const { data, error } = await supabase
      .rpc('validate_api_key', { p_api_key: apiKey }) as SupabaseRPCResponse<ValidateApiKeyResponse>;

    if (error || !data || !Array.isArray(data) || data.length === 0) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'Invalid API key',
      });
    }

    const apiKeyData = data[0];
    if (!apiKeyData) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'Invalid API key data',
      });
    }

    // Check if the API key is active
    if (!apiKeyData.is_active) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'API key is inactive',
      });
    }

    // Check if the API key has expired
    if (apiKeyData.expiration_date && new Date(apiKeyData.expiration_date) < new Date()) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'API key has expired',
      });
    }

    // Attach user information to the request
    (req as AuthenticatedRequest).user = {
      id: apiKeyData.merchant_id,
      organizationId: apiKeyData.organization_id,
      environment: apiKeyData.environment,
    };

    // Add environment header for downstream services
    res.setHeader('X-Environment', apiKeyData.environment);

    next();
  } catch (error) {
    console.error('Error validating API key:', error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while validating the API key',
    });
  }
} 