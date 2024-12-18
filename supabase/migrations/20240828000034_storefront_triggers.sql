-- Function to create initial storefront
CREATE OR REPLACE FUNCTION public.create_initial_storefront()
RETURNS TRIGGER AS $$
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
        NEW.merchant_id,
        NEW.organization_id,
        (SELECT name FROM organizations WHERE organization_id = NEW.organization_id),
        NULL,
        '#3B82F6',
        LOWER(REGEXP_REPLACE(
            (SELECT name FROM organizations WHERE organization_id = NEW.organization_id),
            '[^a-zA-Z0-9]+',
            '-',
            'g'
        ))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Trigger to create storefront when merchant-organization link is created
CREATE TRIGGER create_initial_storefront_trigger
AFTER INSERT ON merchant_organization_links
FOR EACH ROW
EXECUTE FUNCTION create_initial_storefront(); 