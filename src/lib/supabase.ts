
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ugydhonclcdhgfcuevcd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVneWRob25jbGNkaGdmY3VldmNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNDM1NjIsImV4cCI6MjA1ODcxOTU2Mn0.JiJFrHp4UC1WNDsy-0Qe_hirCiAHNR9HsGRmGtu1PSM';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
