import { Pool } from 'pg';
import { Transfer } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createTransfer(source_account_id: number, destination_account_id: number, amount: number, currency_id: number): Promise<Transfer> {
  const query = 'SELECT * FROM create_transfer($1, $2, $3, $4)';
  const values = [source_account_id, destination_account_id, amount, currency_id];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getTransferById(transferId: number): Promise<Transfer | null> {
  const query = 'SELECT * FROM get_transfer_by_id($1)';
  const values = [transferId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}