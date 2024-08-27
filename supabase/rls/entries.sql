ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own entries" ON entries
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM accounts WHERE account_id = entries.account_id));

CREATE POLICY "Users can create entries for their own accounts" ON entries
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM accounts WHERE account_id = entries.account_id));

CREATE POLICY "Users can update their own entries" ON entries
  FOR UPDATE USING (auth.uid() = (SELECT user_id FROM accounts WHERE account_id = entries.account_id));

CREATE POLICY "Admins can view all entries" ON entries
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));

CREATE POLICY "Admins can update all entries" ON entries
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));