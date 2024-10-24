-- Create a new bucket for storing support request images
INSERT INTO storage.buckets (id, name, public)
VALUES ('support_request_images', 'support_request_images', false)
ON CONFLICT (id) DO NOTHING;

-- Grant access to authenticated users to use the bucket
CREATE POLICY "Allow authenticated users to upload images to their own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'support_request_images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE OR REPLACE POLICY "Allow authenticated users to read their own images"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'support_request_images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Function to create a new support request
CREATE OR REPLACE FUNCTION public.create_support_request(
    p_merchant_id UUID,
    p_category support_category,
    p_message TEXT,
    p_image_url TEXT DEFAULT NULL,
    p_priority support_priority DEFAULT 'normal'
)
RETURNS UUID AS $$
DECLARE
    v_support_request_id UUID;
BEGIN
    INSERT INTO support_requests (merchant_id, category, message, image_url, priority)
    VALUES (p_merchant_id, p_category, p_message, p_image_url, p_priority)
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
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

-- Trigger to call the update_support_request_timestamp function
CREATE TRIGGER update_support_request_timestamp
BEFORE UPDATE ON support_requests
FOR EACH ROW
EXECUTE FUNCTION update_support_request_timestamp();
