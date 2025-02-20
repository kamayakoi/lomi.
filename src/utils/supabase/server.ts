import { createClient } from '@supabase/supabase-js'
import Cookies from 'js-cookie'
import type { Database } from 'database.types'

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

export function createServerClient(
  supabaseUrl: string,
  supabaseKey: string,
  options: {
    cookies?: {
      get: () => string | null | undefined
      set: (name: string, value: string, options: object) => void
      remove: (name: string, options: object) => void
    }
  } = {}
) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or key')
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      storage: options.cookies
        ? {
            getItem: () => {
              const value = options.cookies?.get()
              return value ?? null
            },
            setItem: (key: string, value: string) => {
              options.cookies?.set(key, value, { path: '/' })
            },
            removeItem: (key: string) => {
              options.cookies?.remove(key, { path: '/' })
            },
          }
        : undefined,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

export function createStorageClient(
  supabaseUrl: string,
  supabaseKey: string,
  options: {
    cookies?: {
      get: () => string | null | undefined
      set: (name: string, value: string, options: object) => void
      remove: (name: string, options: object) => void
    }
  } = {}
) {
  const client = createServerClient(supabaseUrl, supabaseKey, options)
  return client.storage
}