import { Pool } from 'pg';
import { Refund } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createRefund(transaction_id: number, amount: number, currency_id: number, reason: string): Promise<Refund> {
  const query = 'SELECT * FROM create_refund($1, $2, $3, $4)';
  const values = [transaction_id, amount, currency_id, reason];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getRefundById(refundId: number): Promise<Refund | null> {
  const query = 'SELECT * FROM get_refund_by_id($1)';
  const values = [refundId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}