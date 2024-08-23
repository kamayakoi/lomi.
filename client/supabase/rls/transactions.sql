ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" ON transactions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON transactions
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));

CREATE POLICY "Admins can update all transactions" ON transactions
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));