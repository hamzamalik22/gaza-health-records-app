// App-wide constants for HealthRecordsJS

export const COLORS = {
  primary: '#1976d2',
  accent: '#43a047',
  danger: '#e53935',
  background: '#f5f5f5',
  text: '#222',
  border: '#e0e0e0',
  success: '#388e3c',
  warning: '#ffa000',
  info: '#0288d1',
  muted: '#888',
  white: '#fff',
};

export const STORAGE_KEYS = {
  deviceName: 'device_name',
  appSettings: 'app_settings',
  areaCode: 'area_code',
  supabaseUrl: 'supabase_url',
  supabaseKey: 'supabase_key',
  lastSyncTime: 'last_sync_time',
};

export const BLE = {
  SERVICE_UUID: '0000abcd-0000-1000-8000-00805f9b34fb',
  CHARACTERISTIC_UUID: '0000dcba-0000-1000-8000-00805f9b34fb',
};

export const SYNC = {
  CHUNK_SIZE: 512, // bytes
  RETRY_LIMIT: 3,
  RETRY_DELAY: 2000, // ms
};

// Enhanced patient demographics
export const PATIENT_DEMOGRAPHICS = {
  gender: ['male', 'female', 'other', 'prefer_not_to_say'],
  maritalStatus: ['single', 'married', 'divorced', 'widowed', 'separated'],
  educationLevel: ['none', 'primary', 'secondary', 'higher_secondary', 'university', 'postgraduate'],
  occupation: ['unemployed', 'student', 'farmer', 'laborer', 'business', 'professional', 'homemaker', 'retired', 'other'],
  bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
  emergencyContact: ['spouse', 'parent', 'sibling', 'child', 'friend', 'other'],
};

// Medical information categories
export const MEDICAL_CATEGORIES = {
  conditions: ['diabetes', 'hypertension', 'asthma', 'heart_disease', 'cancer', 'hiv_aids', 'tuberculosis', 'malaria', 'other'],
  allergies: ['medication', 'food', 'environmental', 'none', 'unknown'],
  medications: ['insulin', 'blood_pressure', 'asthma_inhaler', 'antibiotics', 'pain_relievers', 'none', 'other'],
};

// Area codes for NGO dashboard
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
  'OTHER': 'Other',
};
