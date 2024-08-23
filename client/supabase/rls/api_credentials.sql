ALTER TABLE api_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage API credentials" ON api_credentials
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));