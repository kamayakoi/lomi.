-- Create a new invoice
CREATE OR REPLACE FUNCTION create_invoice(
  p_user_id UUID,
  p_organization_id UUID,
  p_amount NUMERIC(10,2),
  p_description TEXT,
  p_currency_code currency_code,
  p_due_date DATE,
  p_status invoice_status DEFAULT 'draft'
) RETURNS invoices AS $$
DECLARE
  new_invoice invoices;
BEGIN
  -- Insert the new invoice
  INSERT INTO invoices (user_id, organization_id, amount, description, currency_code, due_date, status)
  VALUES (p_user_id, p_organization_id, p_amount, p_description, p_currency_code, p_due_date, p_status)
  RETURNING * INTO new_invoice;
  
  RETURN new_invoice;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read an invoice by ID
CREATE OR REPLACE FUNCTION get_invoice_by_id(p_invoice_id UUID)
RETURNS invoices AS $$
  SELECT * FROM invoices WHERE invoice_id = p_invoice_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update an invoice
CREATE OR REPLACE FUNCTION update_invoice(
  p_invoice_id UUID,
  p_amount NUMERIC(10,2),
  p_description TEXT,
  p_currency_code currency_code,
  p_due_date DATE,
  p_status invoice_status
) RETURNS invoices AS $$
DECLARE
  updated_invoice invoices;
BEGIN
  -- Update the invoice
  UPDATE invoices
  SET 
    amount = p_amount,
    description = p_description,
    currency_code = p_currency_code,
    due_date = p_due_date,
    status = p_status,
    updated_at = NOW()
  WHERE invoice_id = p_invoice_id
  RETURNING * INTO updated_invoice;
  
  RETURN updated_invoice;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;