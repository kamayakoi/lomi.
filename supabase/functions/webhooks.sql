-- Create a new webhook
CREATE OR REPLACE FUNCTION create_webhook(
  p_user_id UUID,
  p_url VARCHAR,
  p_events VARCHAR[],
  p_secret VARCHAR,
  p_is_active BOOLEAN DEFAULT true
) RETURNS webhooks AS $$
DECLARE
  new_webhook webhooks;
BEGIN
  -- Insert the new webhook
  INSERT INTO webhooks (user_id, url, events, secret, is_active)
  VALUES (p_user_id, p_url,  p_events, p_secret, p_is_active)
  RETURNING * INTO new_webhook;
  
  RETURN new_webhook;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a webhook by ID
CREATE OR REPLACE FUNCTION get_webhook_by_id(p_webhook_id UUID)
RETURNS webhooks AS $$
  SELECT * FROM webhooks WHERE webhook_id = p_webhook_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update a webhook
CREATE OR REPLACE FUNCTION update_webhook(
  p_webhook_id UUID,
  p_url VARCHAR,
  p_events VARCHAR[],
  p_secret VARCHAR,
  p_is_active BOOLEAN
) RETURNS webhooks AS $$
DECLARE
  updated_webhook webhooks;
BEGIN
  -- Update the webhook
  UPDATE webhooks
  SET 
    url = p_url,
    events = p_events,
    secret = p_secret,
    is_active = p_is_active,
    updated_at = NOW()
  WHERE webhook_id = p_webhook_id
  RETURNING * INTO updated_webhook;
  
  RETURN updated_webhook;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete a webhook
CREATE OR REPLACE FUNCTION delete_webhook(p_webhook_id UUID)
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