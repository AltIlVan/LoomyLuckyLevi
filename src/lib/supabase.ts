import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnvOrLocal = (key: string, envVal: string | undefined): string => {
  return localStorage.getItem(key) || envVal || '';
};

const supabaseUrl = getEnvOrLocal('loomy_supabase_url', import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = getEnvOrLocal('loomy_supabase_anon_key', import.meta.env.VITE_SUPABASE_ANON_KEY);

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'));
};

let client: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    try {
      client = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return client;
};

export const updateSupabaseCredentials = (url: string, key: string) => {
  if (url) localStorage.setItem('loomy_supabase_url', url);
  else localStorage.removeItem('loomy_supabase_url');

  if (key) localStorage.setItem('loomy_supabase_anon_key', key);
  else localStorage.removeItem('loomy_supabase_anon_key');

  client = null; // Reset cached client
};
