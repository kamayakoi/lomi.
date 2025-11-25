/* @proprietary license */

import { createAnonymousClient } from '@/lib/supabase/server';
import type { Job } from '@/lib/types/types';

// Server-side function to fetch all active jobs
export async function getActiveJobsServer(): Promise<Job[]> {
  const supabase = createAnonymousClient();

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Failed to fetch jobs');
  }

  return data || [];
}

// Server-side function to get unique departments
export async function getUniqueDepartmentsServer(): Promise<string[]> {
  const supabase = createAnonymousClient();

  const { data, error } = await supabase
    .from('jobs')
    .select('department')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching departments:', error);
    throw new Error('Failed to fetch departments');
  }

  // Extract unique departments
  const departments = [...new Set((data || []).map((job) => job.department))];
  return departments.sort();
}

// Server-side function to fetch a single job by slug
export async function getJobBySlugServer(slug: string): Promise<Job | null> {
  const supabase = createAnonymousClient();

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return null;
    }
    console.error('Error fetching job:', error);
    throw new Error('Failed to fetch job');
  }

  return data;
}

// Server-side function to get unique locations
export async function getUniqueLocationsServer(): Promise<string[]> {
  const supabase = createAnonymousClient();

  const { data, error } = await supabase
    .from('jobs')
    .select('location')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching locations:', error);
    throw new Error('Failed to fetch locations');
  }

  // Extract unique locations
  const locations = [...new Set((data || []).map((job) => job.location))];
  return locations.sort();
}
