import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://ogottjnxqctpbvybldqx.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nb3R0am54cWN0cGJ2eWJsZHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NDE1ODQsImV4cCI6MjA2ODUxNzU4NH0.KfBLz-U_cDu2TYy8YNDpeqGhDgryYGp6KVTiTXcgffw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
