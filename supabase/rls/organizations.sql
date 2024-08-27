ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their organizations" ON organizations
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM user_organization_links
    WHERE organization_id = organizations.organization_id  
  ));

CREATE POLICY "Admins can update their organizations" ON organizations
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM user_organization_links
    WHERE organization_id = organizations.organization_id AND role = 'admin'
  ));