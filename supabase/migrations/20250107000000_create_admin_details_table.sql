-- Create admin_details table for separated admin accounts
CREATE TABLE IF NOT EXISTS public.admin_details (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' NOT NULL,
  active BOOLEAN DEFAULT true NOT NULL,
  last_login TIMESTAMPTZ,
  login_attempts INTEGER DEFAULT 0 NOT NULL,
  locked_until TIMESTAMPTZ,
  created_by INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_details_username ON public.admin_details (username);
CREATE INDEX IF NOT EXISTS idx_admin_details_email ON public.admin_details (email);
CREATE INDEX IF NOT EXISTS idx_admin_details_active ON public.admin_details (active);

-- trigger to update updated_at
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp ON public.admin_details;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.admin_details
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();
