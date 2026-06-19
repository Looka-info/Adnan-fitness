import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to get typed table data
export const db = {
  admin: supabase.from('admin'),
  member: supabase.from('member'),
  payment: supabase.from('payment'),
  expense: supabase.from('expense')
};