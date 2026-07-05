import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vY2stcmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDc4ODUwMDAsImV4cCI6MTkwNzQ0NTAwMH0.mock-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
