ALTER TABLE api_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view API providers" ON api_providers
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage API providers" ON api_providers
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));