import { Pool } from 'pg';
import { User } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createClient(name: string, email: string, phone_number: string): Promise<User> {
  const query = 'SELECT * FROM create_user($1, $2, $3)';
  const values = [name, email, phone_number];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getClientById(clientId: number): Promise<User | null> {
  const query = 'SELECT * FROM get_user_by_id($1)';
  const values = [clientId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function updateClient(clientId: number, name: string, email: string, phone_number: string): Promise<User | null> {
  const query = 'SELECT * FROM update_user($1, $2, $3, $4)';
  const values = [clientId, name, email, phone_number];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}