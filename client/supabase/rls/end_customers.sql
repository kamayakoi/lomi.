ALTER TABLE end_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own end customers" ON end_customers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own end customers" ON end_customers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own end customers" ON end_customers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all end customers" ON end_customers
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));

CREATE POLICY "Admins can update all end customers" ON end_customers
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));