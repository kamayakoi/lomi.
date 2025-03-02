import { Request, Response } from 'express';
import { supabase } from '@/utils/supabase/client';

export async function handlePaymentLink(req: Request, res: Response) {
    const { merchantId, orderId, productId, planId } = req.params;

    try {
        // Fetch the payment link data from the database
        const { data: paymentLinkData, error: paymentLinkError } = await supabase
            .from('payment_links')
            .select('*')
            .eq('merchant_id', merchantId)
            .eq('order_id', orderId)
            .single();

        if (paymentLinkError) {
            console.error('Error fetching payment link data:', paymentLinkError);
            return res.status(500).json({ error: 'Failed to fetch payment link data' });
        }

        // Fetch the necessary data based on the payment link type
        let additionalData = {};
        if (paymentLinkData.link_type === 'product' && productId) {
            const { data: productData, error: productError } = await supabase
                .rpc('get_product_by_id', { prod_id: productId });

            if (productError) {
                console.error('Error fetching product data:', productError);
                return res.status(500).json({ error: 'Failed to fetch product data' });
            }

            additionalData = productData;
        } else if (paymentLinkData.link_type === 'plan' && planId) {
            // Fetch plan data
            // ...
        }

        // Render the checkout page with the fetched data
        return res.render('checkout', {
            paymentLink: paymentLinkData,
            additionalData,
        });
    } catch (error) {
        console.error('Error handling payment link:', error);
        return res.status(500).json({ error: 'Failed to handle payment link' });
    }
}
