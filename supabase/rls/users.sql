ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user data" ON users
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE user_id = auth.uid() AND is_admin
  ));

CREATE POLICY "Admins can update all user data" ON users
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));