import { Pool } from 'pg';
import { ApiCredential } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createApiCredential(provider_id: number, name: string, api_key: string, api_secret: string): Promise<ApiCredential> {
  const query = 'INSERT INTO api_credentials (provider_id, name, api_key, api_secret) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [provider_id, name, api_key, api_secret];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getApiCredentialById(apiCredentialId: number): Promise<ApiCredential | null> {
  const query = 'SELECT * FROM api_credentials WHERE api_credential_id = $1';
  const values = [apiCredentialId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function updateApiCredential(apiCredentialId: number, name: string, api_key: string, api_secret: string): Promise<ApiCredential | null> {
  const query = 'UPDATE api_credentials SET name = $1, api_key = $2, api_secret = $3 WHERE api_credential_id = $4 RETURNING *';
  const values = [name, api_key, api_secret, apiCredentialId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function deleteApiCredential(apiCredentialId: number): Promise<void> {
  const query = 'DELETE FROM api_credentials WHERE api_credential_id = $1';
  const values = [apiCredentialId];
  await pool.query(query, values);
}