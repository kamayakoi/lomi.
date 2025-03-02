import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    organizationId: string;
    environment: 'test' | 'live';
  };
}

export interface ValidateApiKeyResponse {
  merchant_id: string;
  organization_id: string;
  is_active: boolean;
  expiration_date: string | null;
  environment: 'test' | 'live';
}

export interface SupabaseRPCResponse<T> {
  data: T[] | null;
  error: {
    message: string;
    code?: string;
  } | null;
}

export interface ValidateApiKeyParams {
  p_api_key: string;
} 