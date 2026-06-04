// ─── QuoteKit Plan Definitions ───────────────────────────────────────────────
// Single source of truth. Used by: PricingPage, FeatureGate, Settings/Billing,
// Stripe checkout, and Supabase RLS (via plan column on users table).
//
// Stripe product IDs must match your Stripe dashboard.
// Set these in your .env file after creating products in Stripe.
// ─────────────────────────────────────────────────────────────────────────────

export type PlanId = 'starter' | 'pro' | 'business';

export interface PlanLimit {
  proposals: number | 'unlimited';       // per month
  clients: number | 'unlimited';
  aiGenerations: number | 'unlimited';   // QuickPropose runs per month
  teamSeats: number | 'unlimited';
  customDomain: boolean;
  whiteLabel: boolean;                   // remove QuoteKit branding from portal
  stripePayout: boolean;                 // collect payments via Stripe
  mpesa: boolean;                        // M-Pesa (East Africa)
  multiCurrency: boolean;
  analytics: boolean;
  automations: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
  dedicatedManager: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  priceCAD: number | 0;   // 0 = free
  priceUSD: number | 0;
  billingInterval: 'month' | 'free';
  trialDays: number;
  stripePriceIdCAD: string | null;   // e.g. price_xxx from Stripe
  stripePriceIdUSD: string | null;
  popular: boolean;
  limits: PlanLimit;
  perks: string[];         // marketing bullet points shown on pricing page
  notIncluded: string[];   // shown as greyed-out on pricing table
}

// ─── PLANS ───────────────────────────────────────────────────────────────────

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For freelancers just getting started',
    priceCAD: 0,
    priceUSD: 0,
    billingInterval: 'free',
    trialDays: 14,
    stripePriceIdCAD: null,
    stripePriceIdUSD: null,
    popular: false,
    limits: {
      proposals: 5,
      clients: 10,
      aiGenerations: 3,
      teamSeats: 1,
      customDomain: false,
      whiteLabel: false,
      stripePayout: false,
      mpesa: false,
      multiCurrency: false,
      analytics: false,
      automations: false,
      apiAccess: false,
      prioritySupport: false,
      dedicatedManager: false,
    },
    perks: [
      '5 proposals per month',
      '10 clients',
      '3 AI QuickPropose generations',
      'PDF export',
      'E-signature (basic)',
      'Client portal (with QuoteKit branding)',
      'Email delivery',
      'Community support',
    ],
    notIncluded: [
      'Custom branding',
      'Stripe payment collection',
      'Automation workflows',
      'Analytics & tracking',
      'Team seats',
      'API access',
    ],
  },

  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For professionals who want to win every deal',
    priceCAD: 49,
    priceUSD: 36,
    billingInterval: 'month',
    trialDays: 14,
    stripePriceIdCAD: import.meta.env.VITE_STRIPE_PRICE_PRO_CAD ?? null,
    stripePriceIdUSD: import.meta.env.VITE_STRIPE_PRICE_PRO_USD ?? null,
    popular: true,
    limits: {
      proposals: 'unlimited',
      clients: 'unlimited',
      aiGenerations: 30,
      teamSeats: 1,
      customDomain: false,
      whiteLabel: true,
      stripePayout: true,
      mpesa: false,
      multiCurrency: false,
      analytics: true,
      automations: true,
      apiAccess: false,
      prioritySupport: true,
      dedicatedManager: false,
    },
    perks: [
      'Unlimited proposals',
      'Unlimited clients',
      '30 AI QuickPropose generations/month',
      'Custom branding — your logo, your colours',
      'Remove QuoteKit branding from client portal',
      'Stripe payment collection (deposits & full)',
      'Live proposal tracking (opens, time on page)',
      'Automation workflows (follow-ups, reminders)',
      'Analytics dashboard',
      'PDF export (custom branded)',
      'E-signature (legally binding)',
      'Priority email support',
    ],
    notIncluded: [
      'Team seats',
      'Custom domain for client portal',
      'M-Pesa / East Africa payments',
      'API access',
      'Dedicated account manager',
    ],
  },

  {
    id: 'business',
    name: 'Business',
    tagline: 'For agencies, studios & growing teams',
    priceCAD: 99,
    priceUSD: 73,
    billingInterval: 'month',
    trialDays: 14,
    stripePriceIdCAD: import.meta.env.VITE_STRIPE_PRICE_BUSINESS_CAD ?? null,
    stripePriceIdUSD: import.meta.env.VITE_STRIPE_PRICE_BUSINESS_USD ?? null,
    popular: false,
    limits: {
      proposals: 'unlimited',
      clients: 'unlimited',
      aiGenerations: 'unlimited',
      teamSeats: 10,
      customDomain: true,
      whiteLabel: true,
      stripePayout: true,
      mpesa: true,
      multiCurrency: true,
      analytics: true,
      automations: true,
      apiAccess: true,
      prioritySupport: true,
      dedicatedManager: true,
    },
    perks: [
      'Everything in Pro',
      'Up to 10 team seats',
      'Unlimited AI QuickPropose generations',
      'Custom domain for client portal (yourcompany.com)',
      'Multi-currency: CAD, USD, KES, TZS, UGX, RWF',
      'M-Pesa & mobile money payments (East Africa)',
      'GST/HST & East Africa VAT engine',
      'Full API access',
      'Webhook integrations (Zapier, Make, n8n)',
      'White-label mobile experience',
      'Dedicated account manager',
      'Phone + priority chat support',
      'SSO / SAML (coming Q3 2026)',
    ],
    notIncluded: [],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const getPlan = (id: PlanId): Plan =>
  PLANS.find(p => p.id === id) ?? PLANS[0];

export const canUseFeature = (
  planId: PlanId,
  feature: keyof PlanLimit
): boolean => {
  const plan = getPlan(planId);
  const val = plan.limits[feature];
  if (typeof val === 'boolean') return val;
  if (val === 'unlimited') return true;
  return (val as number) > 0;
};

export const isAtLimit = (
  planId: PlanId,
  feature: 'proposals' | 'clients' | 'aiGenerations' | 'teamSeats',
  currentCount: number
): boolean => {
  const plan = getPlan(planId);
  const limit = plan.limits[feature];
  if (limit === 'unlimited') return false;
  return currentCount >= (limit as number);
};

// ─── Stripe Radar rule (enforced server-side) ─────────────────────────────
// In your Stripe dashboard → Radar → Rules, add:
//   Block if: card_funding = prepaid
// This prevents all prepaid Visa/Mastercard gift cards.
// Credit cards, debit cards, and company cards (corporate Visa/MC) are allowed.
