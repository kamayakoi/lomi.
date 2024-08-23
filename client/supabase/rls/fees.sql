ALTER TABLE fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view fees" ON fees
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage fees" ON fees
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));