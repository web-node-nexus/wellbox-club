import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  console.error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — add them to .env and restart Vite.'
  );
}

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export type DbMember = {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  phone: string | null;
  referral_code: string;
  referred_by: string;
  city: string;
  role: 'member' | 'leader' | 'admin' | 'individual';
  is_leader: boolean;
  team_size: number;
  join_date: string;
  created_at?: string;
  updated_at?: string;
};

export type DbInvestment = {
  id: string;
  user_id: string;
  mobile: string;
  amount: number;
  date: string;
  locked_until: string;
  status: 'locked' | 'unlocked' | 'used';
  payment_id: string | null;
  created_at?: string;
};

export type DbGoldOrder = {
  id: string;
  user_id: string;
  user_name: string;
  user_mobile: string;
  design_id: string;
  design_name: string;
  weight_grams: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'delivered';
  created_at: string;
  investment_ids: string[];
};
