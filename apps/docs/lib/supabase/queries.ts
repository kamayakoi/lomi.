/* @proprietary license */

import { createClient } from '@/lib/supabase/client';
import type {
  Job,
  JobApplication,
  JobApplicationInsert,
  JobApplicationUpdate,
} from '@/lib/types/types';

export type { Job, JobApplication, JobApplicationInsert, JobApplicationUpdate };

// Fetch a single job by slug
export async function getJobBySlug(slug: string): Promise<Job | null> {
  const supabase = createClient();

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

// Create a job application
export async function createJobApplication(
  jobId: string,
  applicationData: Omit<
    JobApplicationInsert,
    'job_id' | 'created_at' | 'updated_at' | 'id' | 'status'
  >,
): Promise<string> {
  const supabase = createClient();

  // Use the RPC function which also sends notification email
  const { data, error } = await supabase.rpc('create_job_application', {
    p_job_id: jobId,
    p_name: applicationData.name,
    p_email: applicationData.email,
    p_linkedin_url: applicationData.linkedin_url,
    p_github_url: applicationData.github_url,
    p_project_note: applicationData.project_note,
    p_resume_url: applicationData.resume_url,
  });

  if (error) {
    console.error('Error creating job application:', error);
    throw new Error('Failed to submit application');
  }

  // Return the application ID (data contains the UUID returned by the RPC function)
  return data;
}

// Fetch a job application by ID (for checking application status)
export async function getJobApplicationById(
  applicationId: string,
): Promise<JobApplication | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('id', applicationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return null;
    }
    console.error('Error fetching job application:', error);
    throw new Error('Failed to fetch job application');
  }

  return data;
}

// Upload resume to storage
export async function uploadResume(
  file: File,
  applicationId: string,
): Promise<string> {
  const supabase = createClient();

  // Create a unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${applicationId}.${fileExt}`;

  const { error } = await supabase.storage
    .from('resumes')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading resume:', error);
    throw new Error('Failed to upload resume');
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('resumes').getPublicUrl(fileName);

  return publicUrl;
}
