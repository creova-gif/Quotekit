-- QuoteKit — Initial Database Schema
-- Run via Supabase dashboard SQL editor or: supabase db push
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Users (extends Supabase auth.users) ────────────────────────────────────
CREATE TABLE public.users (
  id                        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                     TEXT NOT NULL UNIQUE,
  full_name                 TEXT NOT NULL DEFAULT '',
  company_name              TEXT,
  logo_url                  TEXT,
  plan                      TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'business')),
  plan_expires_at           TIMESTAMPTZ,
  stripe_customer_id        TEXT UNIQUE,
  stripe_subscription_id    TEXT UNIQUE,
  subscription_status       TEXT NOT NULL DEFAULT 'trialing'
                              CHECK (subscription_status IN ('active','trialing','past_due','canceled','free')),
  trial_ends_at             TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  country                   TEXT NOT NULL DEFAULT 'CA',
  currency                  TEXT NOT NULL DEFAULT 'CAD',
  province                  TEXT,              -- CA provinces for GST/HST
  timezone                  TEXT NOT NULL DEFAULT 'America/Toronto',
  monthly_proposal_count    INT NOT NULL DEFAULT 0,
  monthly_ai_generation_count INT NOT NULL DEFAULT 0,
  usage_reset_at            TIMESTAMPTZ DEFAULT (DATE_TRUNC('month', NOW()) + INTERVAL '1 month'),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security — users can only read/update their own row
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_row" ON public.users
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ─── Clients ─────────────────────────────────────────────────────────────────
CREATE TABLE public.clients (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  company         TEXT,
  email           TEXT NOT NULL,
  phone           TEXT,
  country         TEXT NOT NULL DEFAULT 'CA',
  currency        TEXT NOT NULL DEFAULT 'CAD',
  notes           TEXT,
  total_revenue   NUMERIC(12,2) NOT NULL DEFAULT 0,
  proposal_count  INT NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'lead' CHECK (status IN ('lead','active','closed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients_owner" ON public.clients
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ─── Proposals ───────────────────────────────────────────────────────────────
CREATE TABLE public.proposals (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  client_id                   UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  title                       TEXT NOT NULL DEFAULT 'Untitled Proposal',
  status                      TEXT NOT NULL DEFAULT 'draft'
                                CHECK (status IN ('draft','sent','viewed','accepted','declined','expired')),
  currency                    TEXT NOT NULL DEFAULT 'CAD',
  tax_rate                    NUMERIC(6,4) NOT NULL DEFAULT 0.13,
  tax_label                   TEXT NOT NULL DEFAULT 'HST (ON 13%)',
  subtotal                    NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount                  NUMERIC(12,2) NOT NULL DEFAULT 0,
  total                       NUMERIC(12,2) NOT NULL DEFAULT 0,
  valid_until                 DATE,
  public_token                UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  selected_package_id         UUID,
  summary                     TEXT,
  cover_title                 TEXT NOT NULL DEFAULT 'Untitled Proposal',
  cover_subtitle              TEXT,
  signed_at                   TIMESTAMPTZ,
  signature_data              TEXT,    -- base64 PNG
  viewed_count                INT NOT NULL DEFAULT 0,
  total_view_duration_seconds INT NOT NULL DEFAULT 0,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
-- Owner can do everything
CREATE POLICY "proposals_owner" ON public.proposals
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
-- Public read via token (for client portal — no auth required)
CREATE POLICY "proposals_public_read" ON public.proposals
  FOR SELECT USING (true);   -- filter by token done in app query

-- ─── Line Items ───────────────────────────────────────────────────────────────
CREATE TABLE public.line_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id   UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  description   TEXT NOT NULL,
  quantity      NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price    NUMERIC(12,2) NOT NULL DEFAULT 0,
  sort_order    INT NOT NULL DEFAULT 0
);

ALTER TABLE public.line_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "line_items_owner" ON public.line_items
  USING (EXISTS (SELECT 1 FROM public.proposals p WHERE p.id = proposal_id AND p.user_id = auth.uid()));
CREATE POLICY "line_items_public_read" ON public.line_items FOR SELECT USING (true);

-- ─── Proposal Packages ────────────────────────────────────────────────────────
CREATE TABLE public.proposal_packages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id     UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  label           TEXT NOT NULL,
  price           NUMERIC(12,2) NOT NULL DEFAULT 0,
  description     TEXT,
  is_recommended  BOOLEAN NOT NULL DEFAULT false,
  sort_order      INT NOT NULL DEFAULT 0
);

ALTER TABLE public.proposal_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "packages_owner" ON public.proposal_packages
  USING (EXISTS (SELECT 1 FROM public.proposals p WHERE p.id = proposal_id AND p.user_id = auth.uid()));
CREATE POLICY "packages_public_read" ON public.proposal_packages FOR SELECT USING (true);

-- ─── Proposal Events (tracking) ───────────────────────────────────────────────
CREATE TABLE public.proposal_events (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id   UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  event_type    TEXT NOT NULL,
  metadata      JSONB NOT NULL DEFAULT '{}',
  ip_address    INET,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.proposal_events ENABLE ROW LEVEL SECURITY;
-- Owner can read all events on their proposals
CREATE POLICY "events_owner_read" ON public.proposal_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.proposals p WHERE p.id = proposal_id AND p.user_id = auth.uid()));
-- Public can INSERT events (client opened proposal, etc.) — no auth required
CREATE POLICY "events_public_insert" ON public.proposal_events FOR INSERT WITH CHECK (true);

-- ─── Invoices ─────────────────────────────────────────────────────────────────
CREATE TABLE public.invoices (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id                 UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
  user_id                     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  client_id                   UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  invoice_number              TEXT NOT NULL UNIQUE,
  status                      TEXT NOT NULL DEFAULT 'draft'
                                CHECK (status IN ('draft','sent','paid','overdue','void')),
  currency                    TEXT NOT NULL DEFAULT 'CAD',
  subtotal                    NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_rate                    NUMERIC(6,4) NOT NULL DEFAULT 0.13,
  tax_amount                  NUMERIC(12,2) NOT NULL DEFAULT 0,
  total                       NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_paid                 NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_due                  NUMERIC(12,2) GENERATED ALWAYS AS (total - amount_paid) STORED,
  due_date                    DATE NOT NULL,
  paid_at                     TIMESTAMPTZ,
  stripe_payment_intent_id    TEXT,
  mpesa_checkout_request_id   TEXT,
  payment_method              TEXT CHECK (payment_method IN ('stripe','mpesa','bank','other')),
  notes                       TEXT,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invoices_owner" ON public.invoices
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "invoices_public_read" ON public.invoices FOR SELECT USING (true);

-- ─── Triggers: updated_at ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at     BEFORE UPDATE ON public.users     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER clients_updated_at   BEFORE UPDATE ON public.clients   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER proposals_updated_at BEFORE UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER invoices_updated_at  BEFORE UPDATE ON public.invoices  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Function: auto-create user profile on signup ────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, trial_ends_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW() + INTERVAL '14 days'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Function: reset monthly usage counters (run via pg_cron monthly) ────────
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET monthly_proposal_count = 0,
      monthly_ai_generation_count = 0,
      usage_reset_at = DATE_TRUNC('month', NOW()) + INTERVAL '1 month'
  WHERE usage_reset_at <= NOW();
END;
$$ LANGUAGE plpgsql;

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_proposals_user_id     ON public.proposals(user_id);
CREATE INDEX idx_proposals_client_id   ON public.proposals(client_id);
CREATE INDEX idx_proposals_public_token ON public.proposals(public_token);
CREATE INDEX idx_proposals_status      ON public.proposals(status);
CREATE INDEX idx_clients_user_id       ON public.clients(user_id);
CREATE INDEX idx_invoices_user_id      ON public.invoices(user_id);
CREATE INDEX idx_proposal_events_proposal_id ON public.proposal_events(proposal_id);
CREATE INDEX idx_proposal_events_created_at  ON public.proposal_events(created_at);
