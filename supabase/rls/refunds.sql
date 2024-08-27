ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own refunds" ON refunds
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own refunds" ON refunds
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create refunds for their own transactions" ON refunds
    FOR INSERT WITH CHECK (auth.uid() = (
    SELECT user_id FROM transactions
    WHERE transaction_id = refunds.transaction_id
  ));

CREATE POLICY "Admins can view all refunds" ON refunds
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));

CREATE POLICY "Admins can update all refunds" ON refunds
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));