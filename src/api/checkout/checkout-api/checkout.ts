import { supabase } from '@/utils/supabase/client'
import { createTransactionWithProvider } from '@/api/services/transactionService'
import { Checkout } from '../checkoutTypes'

export async function initiateCheckout(checkoutData: Checkout) {
    const { data, error } = await supabase
        .from('checkouts')
        .insert(checkoutData)
        .single()

    if (error) {
        throw error
    }

    // Create a transaction with provider details
    await createTransactionWithProvider(
        checkoutData.merchantId,
        checkoutData.organizationId,
        checkoutData.customerId,
        checkoutData.productId,
        checkoutData.subscriptionId,
        checkoutData.transactionType,
        checkoutData.description,
        checkoutData.referenceId,
        checkoutData.metadata,
        checkoutData.amount,
        checkoutData.feeAmount,
        checkoutData.amount - checkoutData.feeAmount,
        checkoutData.feeReference,
        checkoutData.currency,
        checkoutData.providerCode,
        checkoutData.paymentMethodCode,
        checkoutData.providerTransactionId,
        checkoutData.providerPaymentStatus
    );

    return data as Checkout
}

export async function getCheckoutById(id: string) {
    const { data, error } = await supabase
        .from('checkouts')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        throw error
    }

    return data as Checkout
}

export async function updateCheckout(id: string, updates: Partial<Checkout>) {
    const { data, error } = await supabase
        .from('checkouts')
        .update(updates)
        .eq('id', id)
        .single()

    if (error) {
        throw error
    }

    return data as Checkout
}
