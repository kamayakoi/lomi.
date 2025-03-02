import { supabase } from "../../../src/utils/supabase/client"
import type { Database } from '../../../database.types'

export type Organization = Database['public']['Tables']['organizations']['Row']
export type OrganizationInsert = Database['public']['Tables']['organizations']['Insert']
export type OrganizationUpdate = Database['public']['Tables']['organizations']['Update']

export async function fetchOrganizationDetails(merchantId: string) {
  const { data } = await supabase.rpc('fetch_organization_details', {
    p_merchant_id: merchantId
  })
  return data?.[0]
}

export async function fetchTeamMembers(organizationId: string) {
  const { data } = await supabase.rpc('fetch_team_members', {
    p_organization_id: organizationId
  })
  return data
}

export async function fetchProviderSettings(organizationId: string) {
  const { data } = await supabase.rpc('fetch_organization_providers_settings', {
    p_organization_id: organizationId
  })
  return data
}

export async function fetchCheckoutSettings(organizationId: string) {
  const { data } = await supabase.rpc('fetch_organization_checkout_settings', {
    p_organization_id: organizationId
  })
  return data?.[0]
}

export async function updateOrganization(
  organizationId: string,
  updates: {
    name: string
    email: string
    website_url: string
    verified: boolean
    default_currency: Database['public']['Enums']['currency_code']
  }
) {
  const { data } = await supabase.rpc('update_organization_details', {
    p_organization_id: organizationId,
    p_name: updates.name,
    p_email: updates.email,
    p_website_url: updates.website_url,
    p_verified: updates.verified,
    p_default_currency: updates.default_currency
  })
  return data
}

export async function updateProviderSettings(
  organizationId: string,
  providerCode: Database['public']['Enums']['provider_code'],
  updates: {
    is_connected?: boolean
    phone_number?: string
    is_phone_verified?: boolean
  }
) {
  if (updates.phone_number) {
    const { data } = await supabase.rpc('update_organization_provider_phone', {
      p_organization_id: organizationId,
      p_provider_code: providerCode,
      p_phone_number: updates.phone_number
    })
    return data
  }
  
  if (typeof updates.is_connected === 'boolean') {
    const { data } = await supabase.rpc('update_organization_provider_connection', {
      p_organization_id: organizationId,
      p_provider_code: providerCode,
      p_is_connected: updates.is_connected
    })
    return data
  }
}

export async function updateCheckoutSettings(
  organizationId: string,
  settings: {
    default_language?: string
    display_currency?: Database['public']['Enums']['currency_code']
    payment_link_duration?: number
    customer_notifications?: Record<string, any>
    merchant_recipients?: Record<string, any>
    fee_types?: Record<string, any>
  }
) {
  const { data } = await supabase.rpc('update_organization_checkout_settings', {
    p_organization_id: organizationId,
    p_settings: settings
  })
  return data
} 