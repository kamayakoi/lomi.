ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payouts" ON payouts
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM accounts WHERE account_id = payouts.account_id));

CREATE POLICY "Users can create payouts from their own accounts" ON payouts
  FOR INSERT WITH CHECK (auth.uid() = (
    SELECT user_id FROM accounts
    WHERE account_id = payouts.account_id
  ));

CREATE POLICY "Admins can view all payouts" ON payouts
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));

CREATE POLICY "Admins can update all payouts" ON payouts
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));