ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view payment methods" ON payment_methods
  FOR SELECT USING (true);