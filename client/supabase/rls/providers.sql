ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view providers" ON providers
  FOR SELECT USING (true);