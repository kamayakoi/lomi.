import { createClient } from '@supabase/supabase-js'

// Use import.meta.env for client-side code
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
        try {
          if (typeof window !== 'undefined') {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
          }
          return null;
        } catch (error) {
          console.error('Error reading from storage:', error);
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(value));
          }
        } catch (error) {
          console.error('Error writing to storage:', error);
        }
      },
      removeItem: (key: string) => {
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(key);
          }
        } catch (error) {
          console.error('Error removing from storage:', error);
        }
      },
    },
  },
  // Add client-side fetch options
  global: {
    fetch: (url, init) => {
      return fetch(url, {
        ...init,
        keepalive: true,
        cache: 'no-store', // Prevent caching of auth requests
        credentials: 'same-origin'
      })
    }
  }
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
  // Get the current origin
  const origin = typeof window !== 'undefined' ? window.location.origin : siteUrl;
  
  // Always use the full URL with /auth/callback
  const redirectUrl = `${origin}/auth/callback`;
  
  // Log the redirect URL in development
  if (import.meta.env.DEV) {
    console.log('OAuth redirect URL:', redirectUrl);
  }
  
  return redirectUrl;
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getRedirectUrl(),
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      },
      scopes: 'email profile'
    }
  })
  return { data, error }
}

export const signInWithGithub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: getRedirectUrl(),
      scopes: 'user:email'
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