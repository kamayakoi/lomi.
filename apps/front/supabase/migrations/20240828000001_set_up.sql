--------------- SET UP ---------------

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

-- Function to check if a column exists
CREATE OR REPLACE FUNCTION column_exists(p_table_name text, p_column_name text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = p_table_name
        AND column_name = p_column_name
    );
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

-- Function to check if a trigger exists
CREATE OR REPLACE FUNCTION trigger_exists(p_table_name text, p_trigger_name text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM information_schema.triggers
        WHERE event_object_table = p_table_name
        AND trigger_name = p_trigger_name
    );
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

-- Function to automatically create updated_at triggers for tables
CREATE OR REPLACE FUNCTION create_updated_at_trigger(p_table_name text)
RETURNS void AS $$
BEGIN
    IF NOT trigger_exists(p_table_name, 'set_updated_at') THEN
        EXECUTE format('
            CREATE TRIGGER set_updated_at
                BEFORE UPDATE ON %I
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        ', p_table_name);
    END IF;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

-- Function to automatically add updated_at column to tables
CREATE OR REPLACE FUNCTION add_updated_at_column(p_table_name text)
RETURNS void AS $$
BEGIN
    -- Add updated_at column if it doesn't exist
    IF NOT column_exists(p_table_name, 'updated_at') THEN
        EXECUTE format('
            ALTER TABLE %I ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
        ', p_table_name);
    END IF;
    
    -- Create the trigger
    PERFORM create_updated_at_trigger(p_table_name);
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

-- Function to automatically add created_at column to tables
CREATE OR REPLACE FUNCTION add_created_at_column(p_table_name text)
RETURNS void AS $$
BEGIN
    IF NOT column_exists(p_table_name, 'created_at') THEN
        EXECUTE format('
            ALTER TABLE %I ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
        ', p_table_name);
    END IF;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

-- Function to add both timestamp columns and trigger
CREATE OR REPLACE FUNCTION add_timestamp_columns(p_table_name text)
RETURNS void AS $$
BEGIN
    -- Add created_at column
    PERFORM add_created_at_column(p_table_name);
    
    -- Add updated_at column and trigger
    PERFORM add_updated_at_column(p_table_name);
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

-- Function to delete a storage object
CREATE OR REPLACE FUNCTION delete_storage_object(bucket TEXT, object TEXT, OUT status INT, OUT content TEXT)
RETURNS RECORD
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  project_url TEXT;
  service_role_key TEXT;
  url TEXT;
BEGIN
  -- Get credentials from secrets
  project_url := secrets.get_secret('storage_project_url');
  service_role_key := secrets.get_secret('storage_service_role_key');
  url := project_url || '/storage/v1/object/' || bucket || '/' || object;

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
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  SELECT
      INTO status, content
           result.status, result.content
      FROM public.delete_storage_object(bucket_name, object_path) AS result;
END;
$$;

-- Function to safely add an index if it doesn't exist
CREATE OR REPLACE FUNCTION create_index_if_not_exists(
    p_index_name text,
    p_table_name text,
    p_column_name text,
    p_index_type text DEFAULT ''
)
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE indexname = p_index_name
    ) THEN
        EXECUTE format('CREATE INDEX %I ON %I (%I) %s',
            p_index_name,
            p_table_name,
            p_column_name,
            p_index_type
        );
    END IF;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

-- Apply timestamp columns to all existing tables
DO $$ 
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT table_name::text
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    LOOP
        PERFORM add_timestamp_columns(tbl);
    END LOOP;
END $$;