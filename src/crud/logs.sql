-- Create a new log
CREATE OR REPLACE FUNCTION create_log(
  p_user_id UUID,
  p_action VARCHAR,
  p_details JSONB DEFAULT NULL
) RETURNS logs AS $$
DECLARE
  new_log logs;
BEGIN
  -- Insert the new log
  INSERT INTO logs (user_id, action, details)
  VALUES (p_user_id, p_action, p_details)
  RETURNING * INTO new_log;
  
  RETURN new_log;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a log by ID
CREATE OR REPLACE FUNCTION get_log_by_id(p_log_id UUID)
RETURNS logs AS $$
  SELECT * FROM logs WHERE log_id = p_log_id;
$$ LANGUAGE sql SECURITY DEFINER;