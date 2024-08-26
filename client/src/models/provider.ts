import { Pool } from 'pg';
import { Provider } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createProvider(name: string, description: string, base_url: string): Promise<Provider> {
  const query = 'INSERT INTO providers (name, description, base_url) VALUES ($1, $2, $3) RETURNING *';
  const values = [name, description, base_url];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getProviderById(providerId: number): Promise<Provider | null> {
  const query = 'SELECT * FROM providers WHERE provider_id = $1';
  const values = [providerId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function updateProvider(providerId: number, name: string, description: string, base_url: string): Promise<Provider | null> {
  const query = 'UPDATE providers SET name = $1, description = $2, base_url = $3 WHERE provider_id = $4 RETURNING *';
  const values = [name, description, base_url, providerId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function deleteProvider(providerId: number): Promise<void> {
  const query = 'DELETE FROM providers WHERE provider_id = $1';
  const values = [providerId];
  await pool.query(query, values);
}