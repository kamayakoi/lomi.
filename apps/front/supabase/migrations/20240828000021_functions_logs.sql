-- Function to fetch logs for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_logs(
    p_merchant_id UUID,
    p_event event_type DEFAULT NULL,
    p_severity VARCHAR DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    log_id UUID,
    event event_type,
    ip_address VARCHAR,
    operating_system VARCHAR,
    browser VARCHAR,
    details JSONB,
    severity VARCHAR,
    request_url VARCHAR,
    request_method VARCHAR,
    response_status INTEGER,
    created_at TIMESTAMPTZ,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.log_id,
        l.event,
        l.ip_address,
        l.operating_system,
        l.browser,
        l.details,
        l.severity,
        l.request_url,
        l.request_method,
        l.response_status,
        l.created_at,
        COUNT(*) OVER() as total_count
    FROM 
        logs l
    WHERE 
        l.merchant_id = p_merchant_id AND
        (p_event IS NULL OR l.event = p_event) AND
        (p_severity IS NULL OR l.severity = p_severity)
    ORDER BY
        l.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;