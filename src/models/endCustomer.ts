import { Pool } from 'pg';
import { EndCustomer } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createEndCustomer(name: string, email: string, phone_number: string): Promise<EndCustomer> {
  const query = 'SELECT * FROM create_end_customer($1, $2, $3)';
  const values = [name, email, phone_number];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getEndCustomerById(endCustomerId: number): Promise<EndCustomer | null> {
  const query = 'SELECT * FROM get_end_customer_by_id($1)';
  const values = [endCustomerId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function updateEndCustomer(endCustomerId: number, name: string, email: string, phone_number: string): Promise<EndCustomer | null> {
  const query = 'SELECT * FROM update_end_customer($1, $2, $3, $4)';
  const values = [endCustomerId, name, email, phone_number];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}