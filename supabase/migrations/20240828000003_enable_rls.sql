-- Enable Row Level Security (RLS)
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_organization_links ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow SELECT access to merchants table for authenticated users
CREATE POLICY "Allow select access to merchants table for authenticated users"
ON public.merchants
FOR SELECT
TO authenticated
USING (merchant_id = auth.uid());

-- Create a policy to allow SELECT access to the onboarded column for authenticated users
CREATE POLICY "Allow select access to onboarded column for authenticated users"
ON public.merchants
FOR SELECT
USING (merchant_id = auth.uid());

-- Create a policy to allow SELECT access to merchant_organization_links table for authenticated users
CREATE POLICY "Allow select access to merchant_organization_links table for authenticated users"
ON public.merchant_organization_links
FOR SELECT
TO authenticated
USING (merchant_id = auth.uid());