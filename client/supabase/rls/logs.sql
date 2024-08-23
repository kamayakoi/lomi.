ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own logs" ON logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all logs" ON logs
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));