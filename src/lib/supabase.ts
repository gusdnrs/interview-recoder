import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Ensure these are set in .env.local
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Key is missing!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
