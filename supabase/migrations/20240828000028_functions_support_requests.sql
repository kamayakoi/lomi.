-- Create a new bucket for storing support request images
INSERT INTO storage.buckets (id, name, public)
VALUES ('support_request_images', 'support_request_images', false);

-- Function to create a new support request
CREATE OR REPLACE FUNCTION public.create_support_request(
    p_merchant_id UUID,
    p_category support_category,
    p_message TEXT,
    p_image_data BYTEA DEFAULT NULL,
    p_image_name TEXT DEFAULT NULL,
    p_priority support_priority DEFAULT 'normal'
)
RETURNS UUID AS $$
DECLARE
    v_support_request_id UUID;
    v_image_url TEXT := NULL;
    v_content_type TEXT := 'application/octet-stream';
BEGIN
    -- If an image is provided, upload it to the bucket
    IF p_image_data IS NOT NULL THEN
        -- Determine the content type based on the file extension
        IF lower(right(p_image_name, 4)) = '.png' THEN
            v_content_type := 'image/png';
        ELSIF lower(right(p_image_name, 5)) = '.jpeg' THEN
            v_content_type := 'image/jpeg';
        ELSIF lower(right(p_image_name, 4)) = '.gif' THEN
            v_content_type := 'image/gif';
        ELSIF lower(right(p_image_name, 4)) = '.bmp' THEN
            v_content_type := 'image/bmp';
        END IF;

        v_image_url := storage.objects.create(
            'support_request_images',
            p_image_name,
            p_image_data,
            v_content_type
        );
    END IF;

    INSERT INTO support_requests (merchant_id, category, message, image_url, priority)
    VALUES (p_merchant_id, p_category, p_message, v_image_url, p_priority)
    RETURNING support_requests_id INTO v_support_request_id;

    RETURN v_support_request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch support requests for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_support_requests(
    p_merchant_id UUID,
    p_status support_status DEFAULT NULL,
    p_page INTEGER DEFAULT 1,
    p_page_size INTEGER DEFAULT 50
)
RETURNS TABLE (
    support_requests_id UUID,
    category support_category,
    message TEXT,
    image_url TEXT,
    status support_status,
    priority support_priority,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sr.support_requests_id,
        sr.category,
        sr.message,
        sr.image_url,
        sr.status,
        sr.priority,
        sr.created_at,
        sr.updated_at
    FROM 
        support_requests sr
    WHERE 
        sr.merchant_id = p_merchant_id
        AND (p_status IS NULL OR sr.status = p_status)
    ORDER BY
        sr.created_at DESC
    LIMIT p_page_size
    OFFSET ((p_page - 1) * p_page_size);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Trigger function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_support_request_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the update_support_request_timestamp function
CREATE TRIGGER update_support_request_timestamp
BEFORE UPDATE ON support_requests
FOR EACH ROW
EXECUTE FUNCTION update_support_request_timestamp();
