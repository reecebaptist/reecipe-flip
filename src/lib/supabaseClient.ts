import { createClient } from '@supabase/supabase-js';

// Read from CRA env vars (must be prefixed with REACT_APP_)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string | undefined;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Soft warn in dev; avoid throwing to not break static builds
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('Supabase env vars missing. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.');
  }
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export default supabase;
