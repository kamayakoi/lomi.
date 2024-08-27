import { Pool } from 'pg';
import { Log } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createLog(user_id: number, action: string, details: any): Promise<Log> {
  const query = 'INSERT INTO logs (user_id, action, details) VALUES ($1, $2, $3) RETURNING *';
  const values = [user_id, action, details];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getLogById(logId: number): Promise<Log | null> {
  const query = 'SELECT * FROM logs WHERE log_id = $1';
  const values = [logId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}