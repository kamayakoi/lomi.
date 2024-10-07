-- Create the 'logos' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy for selecting (reading) logos
CREATE POLICY "Allow public read access to logos" ON storage.objects
FOR SELECT USING (bucket_id = 'logos');

-- Policy for inserting (uploading) logos
CREATE POLICY "Allow authenticated users to upload logos" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'logos');

-- Policy for updating logos
CREATE POLICY "Allow authenticated users to update their own logos" ON storage.objects
FOR UPDATE TO authenticated USING (
    bucket_id = 'logos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for deleting logos
CREATE POLICY "Allow authenticated users to delete their own logos" ON storage.objects
FOR DELETE TO authenticated USING (
    bucket_id = 'logos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create the 'avatars' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policy for selecting (reading) avatars
CREATE POLICY "Allow public read access to avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Policy for inserting (uploading) avatars
CREATE POLICY "Allow authenticated users to upload avatars" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

-- Policy for updating avatars
CREATE POLICY "Allow authenticated users to update their own avatars" ON storage.objects
FOR UPDATE TO authenticated USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for deleting avatars
CREATE POLICY "Allow authenticated users to delete their own avatars" ON storage.objects
FOR DELETE TO authenticated USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create the 'kyc_documents' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc_documents', 'kyc_documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create subfolders for different types of KYC documents
DO $$
DECLARE
  subfolder_names TEXT[] := ARRAY['identity_proof', 'address_proof', 'business_registration'];
  subfolder_name TEXT;
BEGIN
  FOREACH subfolder_name IN ARRAY subfolder_names
  LOOP
    EXECUTE format('INSERT INTO storage.objects (bucket_id, name) VALUES (''kyc_documents'', ''%s/'') ON CONFLICT DO NOTHING', subfolder_name);
  END LOOP;
END $$;

-- Policy for inserting (uploading) KYC documents
CREATE POLICY "Allow authenticated users to upload KYC documents" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'kyc_documents');

-- Policy for updating KYC documents
CREATE POLICY "Allow authenticated users to update their own KYC documents" ON storage.objects
FOR UPDATE TO authenticated USING (
    bucket_id = 'kyc_documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for deleting KYC documents
CREATE POLICY "Allow authenticated users to delete their own KYC documents" ON storage.objects
FOR DELETE TO authenticated USING (
    bucket_id = 'kyc_documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);