import { Pool } from 'pg';
import { Organization } from '../types';

const pool = new Pool({
  // Database connection configuration
});

export async function createOrganization(name: string, email: string, phone_number: string, country: string): Promise<Organization> {
  const query = 'SELECT * FROM create_organization($1, $2, $3, $4)';
  const values = [name, email, phone_number, country];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getOrganizationById(organizationId: number): Promise<Organization | null> {
  const query = 'SELECT * FROM get_organization_by_id($1)';
  const values = [organizationId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function updateOrganization(organizationId: number, name: string, email: string, phone_number: string, country: string): Promise<Organization | null> {
  const query = 'SELECT * FROM update_organization($1, $2, $3, $4, $5)';
  const values = [organizationId, name, email, phone_number, country];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}