-- Function to fetch notifications for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_notifications(p_merchant_id UUID)
RETURNS TABLE (
    notification_id UUID,
    type notification_type,
    message TEXT,
    is_read BOOLEAN,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.notification_id,
        n.type,
        n.message,
        n.is_read,
        n.created_at
    FROM 
        notifications n
    WHERE 
        n.merchant_id = p_merchant_id
    ORDER BY
        n.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;