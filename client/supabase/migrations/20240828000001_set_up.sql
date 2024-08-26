-- Enable HTTP extension
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to update modified column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now(); 
    RETURN NEW; 
END;
$$ LANGUAGE 'plpgsql';

-- Policy to allow users to read their own files
CREATE POLICY "Allow users to read their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (auth.uid()::text = owner_id::text);

-- Function to delete a storage object
CREATE OR REPLACE FUNCTION delete_storage_object(bucket TEXT, object TEXT, OUT status INT, OUT content TEXT)
RETURNS RECORD
LANGUAGE 'plpgsql'
SECURITY DEFINER
AS $$
DECLARE
  project_url TEXT := 'https://injlwsgidvxehdmwdoov.supabase.co';
  service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imluamx3c2dpZHZ4ZWhkbXdkb292Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMDM5NTE5MCwiZXhwIjoyMDM1OTcxMTkwfQ.s_7csVRfgC_kzke1oqgeiIzAuEA4Ag33fPmGxhLavNo';
  url TEXT := project_url || '/storage/v1/object/' || bucket || '/' || object;
BEGIN
  SELECT
      INTO status, content
           result.status::INT, result.content::TEXT
      FROM extensions.http((
    'DELETE',
    url,
    ARRAY[extensions.http_header('authorization','Bearer ' || service_role_key)],
    NULL,
    NULL)::extensions.http_request) AS result;
END;
$$;

-- Function to delete a storage object from a bucket
CREATE OR REPLACE FUNCTION delete_storage_object_from_bucket(bucket_name TEXT, object_path TEXT, OUT status INT, OUT content TEXT)
RETURNS RECORD
LANGUAGE 'plpgsql'
SECURITY DEFINER
AS $$
BEGIN
  SELECT
      INTO status, content
           result.status, result.content
      FROM public.delete_storage_object(bucket_name, object_path) AS result;
END;
$$;

-- Enum Types
CREATE TYPE user_type AS ENUM ('user', 'admin', 'super_admin');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE transaction_type AS ENUM ('payment', 'refund', 'transfer', 'payout');
CREATE TYPE organization_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE provider_code AS ENUM ('MTN', 'WAVE', 'ORANGE', 'STRIPE', 'PAYPAL', 'LOMI');
CREATE TYPE recurring_payment_type AS ENUM ('subscription', 'installment', 'debt', 'utility', 'other');
CREATE TYPE transfer_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE refund_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE payment_method_code AS ENUM (
    'CREDIT_CARD', 'DEBIT_CARD', 'MOBILE_MONEY', 'BANK_TRANSFER', 'SEPA', 'PAYPAL',
    'APPLE_PAY', 'GOOGLE_PAY', 'CASH', 'CRYPTOCURRENCY', 'IDEAL', 'COUNTER', 'WAVE',
    'AIRTEL_MONEY', 'MPESA', 'AIRTIME', 'POS', 'BANK_USSD', 'E_WALLET', 'QR_CODE', 'USSD'
);
CREATE TYPE currency_code AS ENUM (
    'XOF', 'XAF', 'NGN', 'GHS', 'KES', 'ZAR', 'EGP', 'MAD', 'RWF', 'ETB', 'ZMW', 'NAD', 'USD', 'EUR', 'MRO'
);
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');