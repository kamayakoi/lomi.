ALTER TABLE user_organization_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own org links" ON user_organization_links
  FOR SELECT USING (auth.uid() = user_id);