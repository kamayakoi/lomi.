ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own accounts" ON accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts" ON accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own accounts" ON accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);