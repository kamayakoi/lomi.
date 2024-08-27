ALTER TABLE end_customer_payment_methods ENABLE ROW LEVEL SECURITY;

-- Users can view their own end customers' payment methods
CREATE POLICY "Users can view their own end customers' payment methods" ON end_customer_payment_methods
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM end_customers
    WHERE end_customer_id = end_customer_payment_methods.end_customer_id
  ));

-- Users can create payment methods for their own end customers
CREATE POLICY "Users can create payment methods for their own end customers" ON end_customer_payment_methods
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM end_customers
    WHERE end_customer_id = end_customer_payment_methods.end_customer_id
  ));

-- Users can update payment methods for their own end customers
CREATE POLICY "Users can update payment methods for their own end customers" ON end_customer_payment_methods
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM end_customers
    WHERE end_customer_id = end_customer_payment_methods.end_customer_id
  ));

-- Admins can view all end customer payment methods
CREATE POLICY "Admins can view all end customer payment methods" ON end_customer_payment_methods
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));

-- Admins can manage all end customer payment methods
CREATE POLICY "Admins can manage all end customer payment methods" ON end_customer_payment_methods
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid() AND is_admin
  ));