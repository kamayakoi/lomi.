import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env['VITE_SUPABASE_URL']
const supabaseAnonKey = import.meta.env['VITE_SUPABASE_ANON_KEY']
const siteUrl = import.meta.env['VITE_SITE_URL'] || (typeof window !== 'undefined' ? window.location.origin : '')

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: {
      getItem: (key: string) => {
        if (typeof window !== 'undefined') {
          return window.localStorage.getItem(key);
        }
        return null;
      },
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
      },
      removeItem: (key: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
      },
    },
  },
})

// Helper function for email updates
export const updateUserEmail = async (newEmail: string) => {
  try {
    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail
    }, {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/portal/settings/business-profile`
    });

    if (updateError) throw updateError;

    // Show success message for the first step
    return { 
      data: null, 
      error: null, 
      message: "Please check both your current and new email addresses to complete the change." 
    };
  } catch (error) {
    console.error('Error updating email:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error occurred') 
    };
  }
};

// Helper to get the correct redirect URL based on environment
const getRedirectUrl = () => {
  // In production, always use the site URL
  if (import.meta.env.PROD) {
    return `${siteUrl}/auth/callback`;
  }
  // In development, use localhost
  return `${window.location.origin}/auth/callback`;
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getRedirectUrl()
    }
  })
  return { data, error }
}

export const signInWithGithub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: getRedirectUrl()
    }
  })
  return { data, error }
}

export const signInWithAzure = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'email',
      redirectTo: getRedirectUrl()
    }
  })
  return { data, error }
}

export const checkSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error checking session:', error)
    return null
  }
  return data.session
}