import { Pool } from 'pg';
import { Transaction } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createTransaction(end_customer_id: number, payment_method_id: number, organization_id: number, user_id: number, amount: number, fee_amount: number, fee_id: number, currency_id: number, status: string, transaction_type: string, payment_info: any): Promise<Transaction> {
  const query = 'SELECT * FROM create_transaction($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';
  const values = [end_customer_id, payment_method_id, organization_id, user_id, amount, fee_amount, fee_id, currency_id, status, transaction_type, payment_info];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getTransactionById(transactionId: number): Promise<Transaction | null> {
  const query = 'SELECT * FROM get_transaction_by_id($1)';
  const values = [transactionId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function getTransactionsByOrganizationId(organizationId: number): Promise<Transaction[]> {
  const query = 'SELECT * FROM get_transactions_by_organization_id($1)';
  const values = [organizationId];
  const result = await pool.query(query, values);
  return result.rows;
}