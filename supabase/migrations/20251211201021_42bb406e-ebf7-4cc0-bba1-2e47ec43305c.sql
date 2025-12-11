-- Add 'reseller' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'reseller';

-- Create a function to assign reseller role to a user
CREATE OR REPLACE FUNCTION public.assign_reseller_role(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'reseller')
  ON CONFLICT (user_id) DO UPDATE SET role = 'reseller';
END;
$$;