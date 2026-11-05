/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RAZORPAY_KEY_ID: string;
  /** Do not use in frontend — payout/order verify belongs on a server */
  readonly VITE_RAZORPAY_KEY_SECRET?: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_TWOFACTOR_API_KEY: string;
  readonly VITE_TWOFACTOR_SMS_TEMPLATE: string;
  readonly VITE_TWOFACTOR_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
