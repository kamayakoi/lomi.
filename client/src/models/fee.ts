import { Pool } from 'pg';
import { Fee } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createFee(name: string, description: string, amount: number, currency_id: number): Promise<Fee> {
  const query = 'SELECT * FROM create_fee($1, $2, $3, $4)';
  const values = [name, description, amount, currency_id];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getFeeById(feeId: number): Promise<Fee | null> {
  const query = 'SELECT * FROM get_fee_by_id($1)';
  const values = [feeId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function updateFee(feeId: number, name: string, description: string, amount: number, currency_id: number): Promise<Fee | null> {
  const query = 'SELECT * FROM update_fee($1, $2, $3, $4, $5)';
  const values = [feeId, name, description, amount, currency_id];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}