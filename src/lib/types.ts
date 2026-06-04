export * from './database.types';
export * from './plans';

// Helper type for billing intervals
export type BillingInterval = 'month' | 'free';

// Currency details helper
export interface CurrencyDetails {
  code: string;
  symbol: string;
  name: string;
}
