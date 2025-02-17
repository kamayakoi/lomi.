-- Function to create a new feedback
CREATE OR REPLACE FUNCTION public.create_feedback(
    p_merchant_id UUID,
    p_sentiment VARCHAR(30),
    p_message TEXT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO merchant_feedback (merchant_id, sentiment, message)
    VALUES (p_merchant_id, p_sentiment, p_message);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch feedback for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_feedback(
    p_merchant_id UUID,
    p_page INTEGER DEFAULT 1,
    p_page_size INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    sentiment VARCHAR(30),
    message TEXT,
    status feedback_status,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id,
        f.sentiment,
        f.message,
        f.status,
        f.created_at
    FROM 
        merchant_feedback f
    WHERE 
        f.merchant_id = p_merchant_id
    ORDER BY
        f.created_at DESC
    LIMIT p_page_size
    OFFSET ((p_page - 1) * p_page_size);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
