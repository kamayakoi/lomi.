import { Pool } from 'pg';
import { PaymentMethod } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createPaymentMethod(name: string, description: string, provider_id: number): Promise<PaymentMethod> {
  const query = 'SELECT * FROM create_payment_method($1, $2, $3)';
  const values = [name, description, provider_id];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getPaymentMethodById(paymentMethodId: number): Promise<PaymentMethod | null> {
  const query = 'SELECT * FROM get_payment_method_by_id($1)';
  const values = [paymentMethodId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function updatePaymentMethod(paymentMethodId: number, name: string, description: string, provider_id: number): Promise<PaymentMethod | null> {
  const query = 'SELECT * FROM update_payment_method($1, $2, $3, $4)';
  const values = [paymentMethodId, name, description, provider_id];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}