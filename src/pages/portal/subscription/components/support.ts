import { supabase } from '@/utils/supabase/client'
import { SubscriptionPlan, Subscription, frequency, failed_payment_action, Transaction } from './types'

export async function uploadPlanImage(file: File, merchantId: string): Promise<string | null> {
    try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${merchantId}/${Date.now()}.${fileExt}`

        // Upload the file
        const { error: uploadError } = await supabase.storage
            .from('plan_images')
            .upload(fileName, file)

        if (uploadError) {
            console.error('Error uploading image:', uploadError)
            return null
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from('plan_images')
            .getPublicUrl(fileName)

        if (!publicUrl) {
            console.error('Failed to get public URL for uploaded image')
            return null
        }

        return publicUrl
    } catch (error) {
        console.error('Error in uploadPlanImage:', error)
        return null
    }
}

export async function deletePlanImage(imageUrl: string): Promise<void> {
    const path = imageUrl.split('/').slice(-2).join('/')
    const { error } = await supabase.storage
        .from('plan_images')
        .remove([path])

    if (error) {
        console.error('Error deleting image:', error)
    }
}

export async function fetchSubscriptionPlans(
    merchantId: string,
    page = 1,
    pageSize = 50
): Promise<SubscriptionPlan[]> {
    const { data, error } = await supabase.rpc('fetch_subscription_plans', {
        p_merchant_id: merchantId,
        p_page: page,
        p_page_size: pageSize
    })

    if (error) {
        console.error('Error fetching subscription plans:', error)
        return []
    }

    return data || []
}

export async function createSubscriptionPlan(data: {
    name: string
    description: string | null
    billing_frequency: frequency
    amount: number
    failed_payment_action?: failed_payment_action
    charge_day?: number | null
    metadata?: Record<string, unknown>
    first_payment_type?: string
    display_on_storefront?: boolean
    image_url?: string | null
}): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user found')

    const { data: organizationData, error: organizationError } = await supabase
        .rpc('fetch_organization_details', { p_merchant_id: user.id })

    if (organizationError) throw organizationError
    if (!organizationData?.length) throw new Error('No organization found')

    const { error } = await supabase.rpc('create_subscription_plan', {
        p_merchant_id: user.id,
        p_organization_id: organizationData[0].organization_id,
        p_name: data.name,
        p_description: data.description || '',
        p_billing_frequency: data.billing_frequency,
        p_amount: data.amount,
        p_currency_code: 'XOF',
        p_failed_payment_action: data.failed_payment_action || 'continue',
        p_charge_day: data.charge_day || undefined,
        p_metadata: data.metadata || {},
        p_first_payment_type: data.first_payment_type || 'initial',
        p_display_on_storefront: data.display_on_storefront ?? true,
        p_image_url: data.image_url || undefined
    })

    if (error) throw error
}

export async function updateSubscriptionPlan(planId: string, data: {
    name: string
    description: string | null
    billing_frequency: frequency
    amount: number
    failed_payment_action?: failed_payment_action
    charge_day?: number | null
    metadata?: Record<string, unknown>
    display_on_storefront?: boolean
    image_url?: string | null
}): Promise<void> {
    const { error } = await supabase.rpc('update_subscription_plan', {
        p_plan_id: planId,
        p_name: data.name,
        p_description: data.description || '',
        p_billing_frequency: data.billing_frequency,
        p_amount: data.amount,
        p_failed_payment_action: data.failed_payment_action || 'continue',
        p_charge_day: data.charge_day,
        p_metadata: data.metadata || {},
        p_display_on_storefront: data.display_on_storefront ?? true,
        p_image_url: data.image_url
    })

    if (error) throw error
}

export async function deleteSubscriptionPlan(planId: string): Promise<void> {
    const { error } = await supabase.rpc('delete_subscription_plan', {
        p_plan_id: planId
    })

    if (error) throw error
}

export async function fetchSubscriptions(
    merchantId: string,
    status = 'all',
    page = 1,
    pageSize = 50
): Promise<Subscription[]> {
    const { data, error } = await supabase.rpc('fetch_subscriptions', {
        p_merchant_id: merchantId,
        p_status: status === 'all' ? null : status,
        p_page: page,
        p_page_size: pageSize
    })

    if (error) {
        console.error('Error fetching subscriptions:', error)
        return []
    }

    return data || []
}

export async function fetchSubscriptionTransactions(subscriptionId: string): Promise<Transaction[]> {
    const { data, error } = await supabase.rpc('fetch_subscription_transactions', {
        p_subscription_id: subscriptionId
    })

    if (error) {
        console.error('Error fetching subscription transactions:', error)
        return []
    }

    return data || []
}
