ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transfers" ON transfers
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM accounts 
    WHERE account_id IN (transfers.from_account_id, transfers.to_account_id)
  ));

  CREATE POLICY "Users can create transfers from their own accounts" ON transfers
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM accounts
    WHERE account_id = transfers.from_account_id
  ));