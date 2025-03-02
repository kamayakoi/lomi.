import { createClient } from '@supabase/supabase-js'
import type { Database } from 'database.types'
import { supabase as clientSupabase } from './client'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Use the client instance for auth operations
export const supabase = clientSupabase

// Only for server-side operations that need a different configuration
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