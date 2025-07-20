import Config from 'react-native-config';

// console.log('DEBUG SUPABASE_URL:', Config.SUPABASE_URL);
// console.log('DEBUG SUPABASE_ANON_KEY:', Config.SUPABASE_ANON_KEY);

// Environment configuration for HealthRecordsJS
// This file loads environment variables from .env file

// For React Native, we'll use a different approach since react-native-dotenv
// might not work as expected. We'll create a config file that can be easily
// updated for different environments.

export const SUPABASE_URL = Config.SUPABASE_URL;
export const SUPABASE_ANON_KEY = Config.SUPABASE_ANON_KEY;

// App configuration
export const APP_CONFIG = {
  // Default area code for the app
  DEFAULT_AREA_CODE: 'GAZA_CITY',
  
  // Sync configuration
  SYNC_CONFIG: {
    BATCH_SIZE: 50,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 2000,
  },
  
  // Database configuration
  DB_CONFIG: {
    NAME: 'healthrecords.db',
    VERSION: '1.0',
    SIZE: 200000,
  },
};

// Development flags
export const DEV_CONFIG = {
  DEBUG_MODE: __DEV__,
  LOG_SYNC_OPERATIONS: true,
  LOG_DATABASE_OPERATIONS: true,
}; 