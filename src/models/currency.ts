import { Pool } from 'pg';
import { Currency } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createCurrency(code: string, name: string, symbol: string): Promise<Currency> {
  const query = 'SELECT * FROM create_currency($1, $2, $3)';
  const values = [code, name, symbol];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getCurrencyById(currencyId: number): Promise<Currency | null> {
  const query = 'SELECT * FROM get_currency_by_id($1)';
  const values = [currencyId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function updateCurrency(currencyId: number, code: string, name: string, symbol: string): Promise<Currency | null> {
  const query = 'SELECT * FROM update_currency($1, $2, $3, $4)';
  const values = [currencyId, code, name, symbol];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}