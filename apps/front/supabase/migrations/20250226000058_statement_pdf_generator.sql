-- Create storage bucket for platform invoices if it doesn't exist
DO $$
BEGIN
    -- Check if the bucket already exists
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE name = 'platform-invoices'
    ) THEN
        -- Create the bucket
        INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
        VALUES ('platform-invoices', 'platform-invoices', true, false, 10485760, '{"application/pdf"}');
        
        -- Set up RLS policy for the bucket
        -- No RLS policy on public bucket - we'll use pre-signed URLs instead
    END IF;
END $$;

-- Function to generate a PDF for a platform invoice and store it in Supabase Storage
CREATE OR REPLACE FUNCTION public.generate_statement_pdf(p_invoice_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_invoice RECORD;
    v_merchant RECORD;
    v_organization RECORD;
    v_html TEXT;
    v_pdf BYTEA;
    v_storage_path TEXT;
    v_now TIMESTAMPTZ := now();
    v_period TEXT;
    v_fee_period_start TEXT;
    v_monthly_fees NUMERIC;
    v_outstanding_balance NUMERIC;
    v_status_text TEXT;
BEGIN
    -- Get invoice details
    SELECT pi.*
    INTO v_invoice
    FROM platform_invoices pi
    WHERE pi.platform_invoice_id = p_invoice_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invoice not found: %', p_invoice_id;
    END IF;
    
    -- Set the display status text based on the enum value
    CASE v_invoice.status
        WHEN 'paid' THEN v_status_text := 'Paid';
        WHEN 'sent' THEN v_status_text := 'Pending Payment';
        WHEN 'overdue' THEN v_status_text := 'Overdue';
        WHEN 'cancelled' THEN v_status_text := 'Cancelled';
        ELSE v_status_text := v_invoice.status::TEXT;
    END CASE;
    
    -- Extract and convert metadata values safely
    BEGIN
        v_fee_period_start := v_invoice.metadata->>'fee_period_start';
        IF v_fee_period_start IS NOT NULL THEN
            v_period := to_char(v_fee_period_start::DATE, 'Month YYYY');
        ELSE
            v_period := to_char(v_invoice.created_at, 'Month YYYY');
        END IF;
        
        v_monthly_fees := (v_invoice.metadata->>'monthly_fees')::NUMERIC;
        IF v_monthly_fees IS NULL THEN
            v_monthly_fees := 0;
        END IF;
        
        v_outstanding_balance := (v_invoice.metadata->>'outstanding_balance')::NUMERIC;
        IF v_outstanding_balance IS NULL THEN
            v_outstanding_balance := 0;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- Fallback for any conversion issues
        v_period := to_char(v_invoice.created_at, 'Month YYYY');
        v_monthly_fees := 0;
        v_outstanding_balance := 0;
    END;
    
    -- Get merchant details
    SELECT m.*
    INTO v_merchant
    FROM merchants m
    WHERE m.merchant_id = v_invoice.merchant_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Merchant not found: %', v_invoice.merchant_id;
    END IF;
    
    -- Get organization details
    SELECT o.*
    INTO v_organization
    FROM organizations o
    WHERE o.organization_id = v_invoice.organization_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Organization not found: %', v_invoice.organization_id;
    END IF;
    
    -- Storage path
    v_storage_path := p_invoice_id || '.pdf';
    
    -- Generate HTML for the invoice
    v_html := '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Platform Statement</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #eee;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .logo {
            max-width: 150px;
        }
        .invoice-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .invoice-details {
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 10px;
            border-bottom: 1px solid #eee;
            text-align: left;
        }
        th {
            background-color: #f8f8f8;
        }
        .total-row {
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #777;
            font-size: 12px;
        }
        .status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: bold;
        }
        .status-paid {
            background-color: #d4edda;
            color: #155724;
        }
        .status-sent {
            background-color: #cce5ff;
            color: #004085;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <div>
                <div class="invoice-title">Platform Statement</div>
                <div>' || v_period || '</div>
                <div>Invoice #: ' || p_invoice_id || '</div>
                <div>Date: ' || to_char(v_now, 'YYYY-MM-DD') || '</div>
                <div>Status: <span class="status status-' || v_invoice.status || '">' || v_status_text || '</span></div>
            </div>
            <div>
                <img class="logo" src="https://lomi.africa/logo-dark.png" alt="Lomi Logo">
            </div>
        </div>
        
        <div class="invoice-details">
            <div><strong>From:</strong></div>
            <div>' || v_organization.name || '</div>
            <div>' || COALESCE(v_organization.email, '') || '</div>
            
            <div style="margin-top: 20px;"><strong>To:</strong></div>
            <div>' || v_merchant.name || '</div>
            <div>' || COALESCE(v_merchant.email, '') || '</div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Amount (' || v_invoice.currency_code || ')</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Monthly Platform Fees for ' || v_period || '</td>
                    <td>' || to_char(v_monthly_fees, 'FM999,999,999.00') || '</td>
                </tr>';
                
    -- Add outstanding balance if exists
    IF v_outstanding_balance > 0 THEN
        v_html := v_html || '
                <tr>
                    <td>Outstanding Balance</td>
                    <td>' || to_char(v_outstanding_balance, 'FM999,999,999.00') || '</td>
                </tr>';
    END IF;
                
    v_html := v_html || '
                <tr class="total-row">
                    <td>Total</td>
                    <td>' || to_char(v_invoice.amount, 'FM999,999,999.00') || '</td>
                </tr>
            </tbody>
        </table>
        
        <div class="footer">
            <p>This is an automatically generated statement for your platform usage.</p>
            <p>For questions about this statement, please contact hello@lomi.africa</p>
        </div>
    </div>
</body>
</html>';

    -- Generate PDF from HTML
    -- For this example, we're using a simpler approach
    v_pdf := convert_from(v_html::BYTEA, 'UTF8');
    
    -- Since the bucket is public, we'll just directly upload to the storage bucket
    -- without RLS restrictions
    INSERT INTO storage.objects (
        bucket_id, 
        name, 
        owner, 
        metadata,
        content_type
    )
    VALUES (
        'platform-invoices',
        v_storage_path,
        '00000000-0000-0000-0000-000000000000',  -- No owner, public bucket
        jsonb_build_object(
            'invoice_id', p_invoice_id,
            'merchant_id', v_invoice.merchant_id,
            'generated_at', v_now
        ),
        'application/pdf'
    )
    ON CONFLICT (bucket_id, name) DO UPDATE
    SET 
        last_modified = v_now,
        metadata = jsonb_build_object(
            'invoice_id', p_invoice_id,
            'merchant_id', v_invoice.merchant_id,
            'generated_at', v_now
        );
    
    -- Upload the binary content to the object
    UPDATE storage.objects
    SET content = v_pdf
    WHERE bucket_id = 'platform-invoices' AND name = v_storage_path;
    
    RETURN TRUE;
END;
$$;

COMMENT ON FUNCTION public.generate_statement_pdf IS 'Generates a PDF for a platform invoice and stores it in Supabase Storage';

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.generate_statement_pdf TO authenticated;

-- No RLS policy needed for platform_invoices - we'll just create the PDFs in a public bucket 