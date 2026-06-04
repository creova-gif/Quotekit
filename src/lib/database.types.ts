import type { PlanId } from './plans';

// ─── User ─────────────────────────────────────────────────────────────────────
export interface AppUser {
  id: string;                    // Supabase auth UUID
  email: string;
  full_name: string;
  company_name: string | null;
  logo_url: string | null;
  plan: PlanId;
  plan_expires_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'free';
  trial_ends_at: string | null;
  country: string;               // ISO 3166-1 alpha-2, e.g. 'CA', 'KE'
  currency: string;              // ISO 4217, e.g. 'CAD', 'KES'
  province: string | null;       // for GST/HST, e.g. 'ON', 'QC'
  timezone: string;              // e.g. 'America/Toronto'
  created_at: string;
  updated_at: string;
}

// ─── Client ───────────────────────────────────────────────────────────────────
export interface Client {
  id: string;
  user_id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string;
  currency: string;
  notes: string | null;
  total_revenue: number;
  proposal_count: number;
  status: 'lead' | 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

// ─── Proposal ─────────────────────────────────────────────────────────────────
export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';

export interface LineItem {
  id: string;
  proposal_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  sort_order: number;
}

export interface ProposalPackage {
  id: string;
  proposal_id: string;
  label: string;       // e.g. 'Starter', 'Recommended', 'Growth'
  price: number;
  description: string;
  is_recommended: boolean;
  sort_order: number;
}

export interface Proposal {
  id: string;
  user_id: string;
  client_id: string;
  client?: Client;                 // joined
  title: string;
  status: ProposalStatus;
  currency: string;
  tax_rate: number;                // decimal, e.g. 0.13 for 13% Ontario HST
  tax_label: string;               // e.g. 'HST (ON 13%)'
  subtotal: number;
  tax_amount: number;
  total: number;
  valid_until: string | null;
  public_token: string;            // UUID used in /p/:token URL
  selected_package_id: string | null;
  summary: string | null;         // executive summary copy
  cover_title: string;
  cover_subtitle: string | null;
  signed_at: string | null;
  signature_data: string | null;   // base64 PNG from signature pad
  line_items?: LineItem[];
  packages?: ProposalPackage[];
  viewed_count: number;
  total_view_duration_seconds: number;
  created_at: string;
  updated_at: string;
}

// ─── Proposal Event (tracking) ────────────────────────────────────────────────
export type ProposalEventType =
  | 'sent'
  | 'opened'
  | 'section_viewed'
  | 'package_selected'
  | 'signed'
  | 'accepted'
  | 'declined'
  | 'payment_initiated'
  | 'payment_completed';

export interface ProposalEvent {
  id: string;
  proposal_id: string;
  event_type: ProposalEventType;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// ─── Invoice ──────────────────────────────────────────────────────────────────
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void';

export interface Invoice {
  id: string;
  proposal_id: string | null;
  user_id: string;
  client_id: string;
  client?: Client;
  invoice_number: string;           // e.g. 'INV-0001'
  status: InvoiceStatus;
  currency: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  amount_paid: number;
  amount_due: number;
  due_date: string;
  paid_at: string | null;
  stripe_payment_intent_id: string | null;
  mpesa_checkout_request_id: string | null;
  payment_method: 'stripe' | 'mpesa' | 'bank' | 'other' | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Subscription / Billing ───────────────────────────────────────────────────
export interface BillingInfo {
  plan: PlanId;
  status: AppUser['subscription_status'];
  trial_ends_at: string | null;
  plan_expires_at: string | null;
  stripe_customer_id: string | null;
  monthly_proposal_count: number;
  monthly_ai_generation_count: number;
  client_count: number;
}

// ─── Database shape (for Supabase typed client) ───────────────────────────────
export interface Database {
  public: {
    Tables: {
      users: { Row: AppUser; Insert: Partial<AppUser>; Update: Partial<AppUser> };
      clients: { Row: Client; Insert: Partial<Client>; Update: Partial<Client> };
      proposals: { Row: Proposal; Insert: Partial<Proposal>; Update: Partial<Proposal> };
      line_items: { Row: LineItem; Insert: Partial<LineItem>; Update: Partial<LineItem> };
      proposal_packages: { Row: ProposalPackage; Insert: Partial<ProposalPackage>; Update: Partial<ProposalPackage> };
      proposal_events: { Row: ProposalEvent; Insert: Partial<ProposalEvent>; Update: Partial<ProposalEvent> };
      invoices: { Row: Invoice; Insert: Partial<Invoice>; Update: Partial<Invoice> };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
