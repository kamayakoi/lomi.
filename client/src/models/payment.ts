import { Pool } from 'pg';
import { Payment } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createPayment(transaction_id: number, amount: number, currency_id: number, payment_method_id: number, status: string): Promise<Payment> {
  const query = 'SELECT * FROM create_payment($1, $2, $3, $4, $5)';
  const values = [transaction_id, amount, currency_id, payment_method_id, status];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getPaymentById(paymentId: number): Promise<Payment | null> {
  const query = 'SELECT * FROM get_payment_by_id($1)';
  const values = [paymentId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}