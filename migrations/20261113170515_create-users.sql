-- Store a safe app-facing profile for each InsForge auth user.
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.users FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON TABLE public.users TO authenticated;

CREATE POLICY users_read_own_profile
  ON public.users FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE FUNCTION public.write_user_profile(
  profile_user_id UUID,
  profile_email TEXT,
  profile_data JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $function$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    profile_user_id,
    profile_email,
    COALESCE(NULLIF(profile_data->>'name', ''), NULLIF(profile_data->>'full_name', '')),
    NULLIF(profile_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, public.users.name),
      avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
      updated_at = pg_catalog.now();
END;
$function$;
REVOKE ALL ON FUNCTION public.write_user_profile(UUID, TEXT, JSONB) FROM PUBLIC, anon, authenticated;

CREATE FUNCTION public.handle_auth_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $function$
BEGIN
  PERFORM public.write_user_profile(NEW.id, NEW.email, NEW.profile);
  RETURN NEW;
END;
$function$;
REVOKE ALL ON FUNCTION public.handle_auth_user_profile() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER sync_public_user_profile
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_profile();

