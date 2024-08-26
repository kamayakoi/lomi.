import { Pool } from 'pg';
import { ApiKey } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createApiKey(user_id: number, name: string, key: string, permissions: string[], expires_at: Date): Promise<ApiKey> {
  const query = 'INSERT INTO api_keys (user_id, name, key, permissions, expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const values = [user_id, name, key, permissions, expires_at];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getApiKeyById(apiKeyId: number): Promise<ApiKey | null> {
  const query = 'SELECT * FROM api_keys WHERE api_key_id = $1';
  const values = [apiKeyId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function updateApiKey(apiKeyId: number, name: string, permissions: string[], expires_at: Date): Promise<ApiKey | null> {
  const query = 'UPDATE api_keys SET name = $1, permissions = $2, expires_at = $3 WHERE api_key_id = $4 RETURNING *';
  const values = [name, permissions, expires_at, apiKeyId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function deleteApiKey(apiKeyId: number): Promise<void> {
  const query = 'DELETE FROM api_keys WHERE api_key_id = $1';
  const values = [apiKeyId];
  await pool.query(query, values);
}