-- Function to fetch storefront data
CREATE OR REPLACE FUNCTION public.fetch_storefront_data(p_slug TEXT)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'storefrontId', s.storefront_id,
        'merchantId', s.merchant_id,
        'organizationId', s.organization_id,
        'name', s.name,
        'description', s.description,
        'themeColor', s.theme_color,
        'organizationLogoUrl', o.logo_url,
        'products', (
            SELECT COALESCE(json_agg(
                json_build_object(
                    'id', p.product_id,
                    'name', p.name,
                    'description', p.description,
                    'price', p.price,
                    'currencyCode', p.currency_code
                )
            ), '[]'::json)
            FROM merchant_products p
            WHERE p.organization_id = s.organization_id
            AND p.merchant_id = s.merchant_id
            AND p.is_active = true
        ),
        'subscriptions', (
            SELECT COALESCE(json_agg(
                json_build_object(
                    'id', sp.plan_id,
                    'name', sp.name,
                    'description', sp.description,
                    'amount', sp.amount,
                    'currencyCode', sp.currency_code,
                    'billingFrequency', sp.billing_frequency
                )
            ), '[]'::json)
            FROM subscription_plans sp
            WHERE sp.organization_id = s.organization_id
            AND sp.merchant_id = s.merchant_id
        )
    ) INTO v_result
    FROM storefronts s
    JOIN organizations o ON o.organization_id = s.organization_id
    WHERE s.slug = p_slug
    AND s.is_active = true;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp; 

-- Function to create a new storefront
CREATE OR REPLACE FUNCTION public.create_storefront(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_name VARCHAR,
    p_description TEXT,
    p_theme_color VARCHAR,
    p_slug VARCHAR
)
RETURNS UUID AS $$
DECLARE
    v_storefront_id UUID;
BEGIN
    INSERT INTO storefronts (
        merchant_id,
        organization_id,
        name,
        description,
        theme_color,
        slug
    )
    VALUES (
        p_merchant_id,
        p_organization_id,
        p_name,
        p_description,
        p_theme_color,
        p_slug
    )
    RETURNING storefront_id INTO v_storefront_id;

    RETURN v_storefront_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp; 