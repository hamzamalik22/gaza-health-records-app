import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env.js';

// Supabase configuration
const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'health-records-dashboard',
    },
  },
});

// Test connection
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        return { success: true, message: 'Connection successful, table may not exist yet' };
      }
      throw error;
    }
    
    return { success: true, message: 'Connection successful' };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false, message: error.message };
  }
} 