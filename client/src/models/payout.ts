import { Pool } from 'pg';
import { Payout } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createPayout(transaction_id: number, amount: number, currency_id: number, status: string): Promise<Payout> {
  const query = 'SELECT * FROM create_payout($1, $2, $3, $4)';
  const values = [transaction_id, amount, currency_id, status];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getPayoutById(payoutId: number): Promise<Payout | null> {
  const query = 'SELECT * FROM get_payout_by_id($1)';
  const values = [payoutId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}