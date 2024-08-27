import { Pool } from 'pg';
import { Database } from '../../database.types';

const pool = new Pool({
  // Database connection configuration
});

type ApiKey = Database['public']['Tables']['api_keys']['Row'];
type ApiKeyInsert = Database['public']['Tables']['api_keys']['Insert'];
type ApiKeyUpdate = Database['public']['Tables']['api_keys']['Update'];

export async function createApiKey(apiKeyData: ApiKeyInsert): Promise<ApiKey> {
  const { user_id, api_key, expiration_date } = apiKeyData;
  const query = 'INSERT INTO api_keys (user_id, api_key, expiration_date) VALUES ($1, $2, $3) RETURNING *';
  const values = [user_id, api_key, expiration_date ?? null];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getApiKeyById(keyId: string): Promise<ApiKey | null> {
  const query = 'SELECT * FROM api_keys WHERE key_id = $1';
  const values = [keyId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function updateApiKey(keyId: string, updates: ApiKeyUpdate): Promise<ApiKey | null> {
  const { api_key, is_active, expiration_date } = updates;
  const query = 'UPDATE api_keys SET api_key = COALESCE($1, api_key), is_active = COALESCE($2, is_active), expiration_date = COALESCE($3, expiration_date) WHERE key_id = $4 RETURNING *';
  const values = [api_key, is_active, expiration_date, keyId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function deleteApiKey(keyId: string): Promise<void> {
  const query = 'DELETE FROM api_keys WHERE key_id = $1';
  const values = [keyId];
  await pool.query(query, values);
}