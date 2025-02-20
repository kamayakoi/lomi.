import { createClient, Session } from '@supabase/supabase-js'
import { Database } from 'database.types'

// Use import.meta.env for client-side code
const supabaseUrl = import.meta.env['VITE_SUPABASE_URL']
const supabaseAnonKey = import.meta.env['VITE_SUPABASE_ANON_KEY']
const siteUrl = import.meta.env['VITE_SITE_URL'] || (typeof window !== 'undefined' ? window.location.origin : '')

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'supabase.auth.token',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'x-client-info': 'lomi-dashboard'
    },
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

// Cache the session promise to prevent multiple fetches
let sessionPromise: Promise<Session | null> | null = null;

export const getSession = async () => {
  if (!sessionPromise) {
    sessionPromise = supabase.auth.getSession().then(({ data }) => data.session);
    // Reset the promise after 5 minutes to ensure fresh data
    setTimeout(() => {
      sessionPromise = null;
    }, 5 * 60 * 1000);
  }
  return sessionPromise;
}

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

export default supabase;