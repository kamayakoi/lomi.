ALTER TABLE organization_payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their org payment methods" ON organization_payment_methods
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM user_organization_links 
    WHERE organization_id = organization_payment_methods.organization_id
  ));

  -- CREATE POLICY "Users can create their org payment methods" ON organization_payment_methods
  -- FOR INSERT WITH CHECK (auth.uid() IN (
  --   SELECT user_id FROM user_organization_links
  --   WHERE organization_id = organization_payment_methods.organization_id
  -- ));

  CREATE POLICY "Org admins can view their org payment methods" ON organization_payment_methods
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM user_organization_links
    WHERE organization_id = organization_payment_methods.organization_id AND role = 'admin'
  ));

CREATE POLICY "Org admins can update their org payment methods" ON organization_payment_methods
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM user_organization_links
    WHERE organization_id = organization_payment_methods.organization_id AND role = 'admin'
  ));

  CREATE POLICY "Org admins can create their org payment methods" ON organization_payment_methods
  FOR INSERT USING (auth.uid() IN (
    SELECT user_id FROM user_organization_links
    WHERE organization_id = organization_payment_methods.organization_id AND role = 'admin'
  ));