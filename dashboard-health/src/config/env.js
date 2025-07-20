// Environment configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';
export const DASHBOARD_TITLE = import.meta.env.VITE_DASHBOARD_TITLE || 'NGO Health Records Dashboard';
export const AUTO_REFRESH_INTERVAL = parseInt(import.meta.env.VITE_AUTO_REFRESH_INTERVAL) || 300000; // 5 minutes

// Development mode
export const IS_DEVELOPMENT = import.meta.env.DEV;

// API endpoints
export const API_ENDPOINTS = {
  patients: '/patients',
  sync_logs: '/sync_logs',
  areas: '/areas'
};

// Chart colors
export const CHART_COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#82CA9D', '#FFC658', '#FF7300'
];

// Area codes mapping
export const AREA_CODES = {
  'GAZA_NORTH': 'Gaza North',
  'GAZA_CITY': 'Gaza City',
  'GAZA_CENTRAL': 'Gaza Central',
  'KHAN_YUNIS': 'Khan Yunis',
  'RAFAH': 'Rafah',
  'DEIR_AL_BALAH': 'Deir al-Balah',
  'BEIT_LAHIA': 'Beit Lahia',
  'BEIT_HANOUN': 'Beit Hanoun',
  'JABALIA': 'Jabalia',
  'OTHER': 'Other'
}; 