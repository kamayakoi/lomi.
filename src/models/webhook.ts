import { Pool } from 'pg';
import { Webhook } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createWebhook(url: string, event_type: string, organization_id: number): Promise<Webhook> {
  const query = 'SELECT * FROM create_webhook($1, $2, $3)';
  const values = [url, event_type, organization_id];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getWebhookById(webhookId: number): Promise<Webhook | null> {
  const query = 'SELECT * FROM get_webhook_by_id($1)';
  const values = [webhookId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function updateWebhook(webhookId: number, url: string, event_type: string, organization_id: number): Promise<Webhook | null> {
  const query = 'SELECT * FROM update_webhook($1, $2, $3, $4)';
  const values = [webhookId, url, event_type, organization_id];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}