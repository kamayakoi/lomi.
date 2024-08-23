ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view currencies" ON currencies
  FOR SELECT USING (true);