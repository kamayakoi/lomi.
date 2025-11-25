/* @proprietary license */

export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: Job;
        Insert: JobInsert;
        Update: JobUpdate;
      };
      job_applications: {
        Row: JobApplication;
        Insert: JobApplicationInsert;
        Update: JobApplicationUpdate;
      };
    };
  };
}

export interface Job {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string; // Used in UI for display
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship';
  description: string;
  role_description: string; // Detailed role description
  about_description: string; // About the company/team
  applying_description: string; // Application instructions
  requirements: string[];
  responsibilities: string[];
  nice_to_have: string[] | null;
  salary_range: string | null;
  is_active: boolean;
  posted_by: string | null;
}

export interface JobInsert {
  id?: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship';
  description: string;
  role_description: string;
  about_description: string;
  applying_description: string;
  requirements: string[];
  responsibilities: string[];
  nice_to_have?: string[] | null;
  salary_range?: string | null;
  is_active?: boolean;
  posted_by?: string | null;
}

export interface JobUpdate {
  id?: string;
  created_at?: string;
  updated_at?: string;
  title?: string;
  slug?: string;
  department?: string;
  location?: string;
  type?: string;
  employment_type?: 'full_time' | 'part_time' | 'contract' | 'internship';
  description?: string;
  role_description?: string;
  about_description?: string;
  applying_description?: string;
  requirements?: string[];
  responsibilities?: string[];
  nice_to_have?: string[] | null;
  salary_range?: string | null;
  is_active?: boolean;
  posted_by?: string | null;
}

export interface JobApplication {
  id: string;
  created_at: string;
  updated_at: string;
  job_id: string;
  name: string;
  email: string;
  linkedin_url: string | null;
  github_url: string | null;
  project_note: string | null;
  resume_url: string | null;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
}

export interface JobApplicationInsert {
  id?: string;
  created_at?: string;
  updated_at?: string;
  job_id: string;
  name: string;
  email: string;
  linkedin_url?: string | null;
  github_url?: string | null;
  project_note?: string | null;
  resume_url?: string | null;
  status?: 'pending' | 'reviewing' | 'accepted' | 'rejected';
}

export interface JobApplicationUpdate {
  id?: string;
  created_at?: string;
  updated_at?: string;
  job_id?: string;
  name?: string;
  email?: string;
  linkedin_url?: string | null;
  github_url?: string | null;
  project_note?: string | null;
  resume_url?: string | null;
  status?: 'pending' | 'reviewing' | 'accepted' | 'rejected';
}
