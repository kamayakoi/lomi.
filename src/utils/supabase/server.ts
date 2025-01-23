import { createClient } from '@supabase/supabase-js'
import Cookies from 'js-cookie'

const supabaseUrl = Bun.env['VITE_SUPABASE_URL']
const supabaseAnonKey = Bun.env['VITE_SUPABASE_ANON_KEY']

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (key) => {
        const value = Cookies.get(key)
        return value ? JSON.parse(value) : null
      },
      setItem: (key, value) => {
        Cookies.set(key, JSON.stringify(value), { expires: 365, secure: true, sameSite: 'Strict' })
      },
      removeItem: (key) => {
        Cookies.remove(key)
      },
    },
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
  return { data, error }
}

export const signInWithGithub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
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