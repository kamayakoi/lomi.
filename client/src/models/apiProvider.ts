import { Pool } from 'pg';
import { ApiProvider } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createApiProvider(name: string, description: string, base_url: string): Promise<ApiProvider> {
  const query = 'INSERT INTO api_providers (name, description, base_url) VALUES ($1, $2, $3) RETURNING *';
  const values = [name, description, base_url];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getApiProviderById(apiProviderId: number): Promise<ApiProvider | null> {
  const query = 'SELECT * FROM api_providers WHERE api_provider_id = $1';
  const values = [apiProviderId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function updateApiProvider(apiProviderId: number, name: string, description: string, base_url: string): Promise<ApiProvider | null> {
  const query = 'UPDATE api_providers SET name = $1, description = $2, base_url = $3 WHERE api_provider_id = $4 RETURNING *';
  const values = [name, description, base_url, apiProviderId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function deleteApiProvider(apiProviderId: number): Promise<void> {
  const query = 'DELETE FROM api_providers WHERE api_provider_id = $1';
  const values = [apiProviderId];
  await pool.query(query, values);
}