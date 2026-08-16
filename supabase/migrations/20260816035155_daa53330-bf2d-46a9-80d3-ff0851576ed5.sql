CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE TABLE public.ad_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asp text NOT NULL DEFAULT 'a8',
  name text NOT NULL,
  offer_url text,
  genre text,
  reward text,
  reward_amount numeric NOT NULL DEFAULT 0,
  conditions text,
  ad_link text,
  partner_status text NOT NULL DEFAULT 'none',
  is_active boolean NOT NULL DEFAULT false,
  quiz_ids text[] NOT NULL DEFAULT '{}',
  ai_score integer,
  ai_reason text,
  ai_click_quiz_id text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ad_offers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ad_offers TO authenticated;
GRANT ALL ON public.ad_offers TO service_role;
ALTER TABLE public.ad_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active offers" ON public.ad_offers
  FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Admins can view all offers" ON public.ad_offers
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert offers" ON public.ad_offers
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update offers" ON public.ad_offers
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete offers" ON public.ad_offers
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER ad_offers_updated_at BEFORE UPDATE ON public.ad_offers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX ad_offers_active_idx ON public.ad_offers (is_active);