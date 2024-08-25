-- Create a new webhook
CREATE OR REPLACE FUNCTION create_webhook(
  p_organization_id BIGINT,
  p_name VARCHAR,
  p_url VARCHAR,
  p_events VARCHAR[],
  p_active BOOLEAN,
  p_secret VARCHAR
) RETURNS webhooks AS $$
DECLARE
  new_webhook webhooks;
BEGIN
  -- Validate input
  IF p_organization_id IS NULL OR p_name IS NULL OR p_url IS NULL OR p_events IS NULL OR p_active IS NULL THEN
    RAISE EXCEPTION 'Organization ID, name, URL, events, and active status are required';
  END IF;

  -- Insert the new webhook
  INSERT INTO webhooks (organization_id, name, url, events, active, secret)
  VALUES (p_organization_id, p_name, p_url, p_events, p_active, p_secret)
  RETURNING * INTO new_webhook;
  
  RETURN new_webhook;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a webhook by ID
CREATE OR REPLACE FUNCTION get_webhook_by_id(p_webhook_id BIGINT)
RETURNS webhooks AS $$
  SELECT * FROM webhooks WHERE webhook_id = p_webhook_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update a webhook
CREATE OR REPLACE FUNCTION update_webhook(
  p_webhook_id BIGINT,
  p_name VARCHAR,
  p_url VARCHAR,
  p_events VARCHAR[],
  p_active BOOLEAN,
  p_secret VARCHAR
) RETURNS webhooks AS $$
DECLARE
  updated_webhook webhooks;
BEGIN
  -- Update the webhook
  UPDATE webhooks
  SET 
    name = p_name,
    url = p_url,
    events = p_events,
    active = p_active,
    secret = p_secret,
    updated_at = NOW()
  WHERE webhook_id = p_webhook_id
  RETURNING * INTO updated_webhook;
  
  RETURN updated_webhook;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete a webhook
CREATE OR REPLACE FUNCTION delete_webhook(p_webhook_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE webhooks
  SET deleted_at = NOW()
  WHERE webhook_id = p_webhook_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;