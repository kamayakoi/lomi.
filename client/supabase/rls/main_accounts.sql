ALTER TABLE main_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own main accounts" ON main_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own main accounts" ON main_accounts
  FOR UPDATE USING (auth.uid() = user_id);