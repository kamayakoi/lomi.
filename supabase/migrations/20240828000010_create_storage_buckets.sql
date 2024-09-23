-- Create the 'logos' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', false)
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

-- Create a function to check image dimensions and size
CREATE OR REPLACE FUNCTION check_logo_dimensions()
RETURNS TRIGGER AS $$
DECLARE
    file_size INT;
    width INT;
    height INT;
BEGIN
    -- Get file size
    SELECT octet_length(data) INTO file_size
    FROM storage.objects
    WHERE id = NEW.id;

    -- Check file size (1MB = 1048576 bytes)
    IF file_size > 1048576 THEN
        RAISE EXCEPTION 'File size exceeds 1MB limit';
    END IF;

    -- Get image dimensions (this assumes you're using the image extension in PostgreSQL)
    SELECT image_width(data), image_height(data) INTO width, height
    FROM storage.objects
    WHERE id = NEW.id;

    -- Check dimensions
    IF width < 200 OR height < 200 THEN
        RAISE EXCEPTION 'Image dimensions must be at least 200x200 pixels';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to run the check function
CREATE TRIGGER check_logo_dimensions_trigger
AFTER INSERT OR UPDATE ON storage.objects
FOR EACH ROW
WHEN (NEW.bucket_id = 'logos')
EXECUTE FUNCTION check_logo_dimensions();