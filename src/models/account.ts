import { Pool } from 'pg';
import { Account } from '../types/account';

const pool = new Pool({
  // Database connection configuration
});

export async function createAccount(user_id: number, payment_method_id: number, currency_id: number): Promise<Account> {
  const query = 'SELECT * FROM create_account($1, $2, $3)';
  const values = [user_id, payment_method_id, currency_id];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getAccountById(accountId: number): Promise<Account | null> {
  const query = 'SELECT * FROM get_account_by_id($1)';
  const values = [accountId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function getAccountsByUserId(userId: number): Promise<Account[]> {
  const query = 'SELECT * FROM get_accounts_by_user_id($1)';
  const values = [userId];
  const result = await pool.query(query, values);
  return result.rows;
}