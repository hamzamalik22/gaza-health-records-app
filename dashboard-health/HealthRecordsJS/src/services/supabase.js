import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/env';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Initialize Supabase client
export async function initializeSupabase() {
  if (supabase) return supabase;
  
  try {
    // First try to get from AsyncStorage (user settings)
    let supabaseUrl = await AsyncStorage.getItem(STORAGE_KEYS.supabaseUrl);
    let supabaseKey = await AsyncStorage.getItem(STORAGE_KEYS.supabaseKey);
    
    // If not found in AsyncStorage, use default config
    if (!supabaseUrl || !supabaseKey) {
      supabaseUrl = SUPABASE_URL;
      supabaseKey = SUPABASE_ANON_KEY;
      
      // Save to AsyncStorage for future use
      await AsyncStorage.setItem(STORAGE_KEYS.supabaseUrl, supabaseUrl);
      await AsyncStorage.setItem(STORAGE_KEYS.supabaseKey, supabaseKey);
    }
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration not found');
    }
    
    // Ensure URL has proper format
    if (!supabaseUrl.startsWith('https://')) {
      throw new Error('Supabase URL must start with https://');
    }
    
    console.log('Initializing Supabase with URL:', supabaseUrl);
    
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'X-Client-Info': 'healthrecordsjs-react-native',
        },
      },
    });
    
    return supabase;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    throw error;
  }
}

// Test connection
export async function testConnection() {
  try {
    const client = await initializeSupabase();
    
    // Test with a simple query that doesn't require the table to exist
    const { data, error } = await client
      .from('patients')
      .select('id')
      .limit(1);
    
    if (error) {
      // If table doesn't exist, that's okay - we just want to test the connection
      if (error.code === 'PGRST116') {
        return true; // Connection successful, table just doesn't exist
      }
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    throw error; // Re-throw to get the actual error message
  }
}

// Patient operations
export async function syncPatientToCloud(patient) {
  try {
    const client = await initializeSupabase();
    
    // Check if patient exists
    const { data: existing } = await client
      .from('patients')
      .select('id, updated_at')
      .eq('unique_id', patient.unique_id)
      .single();
    
    if (existing) {
      // Update existing patient
      const { data, error } = await client
        .from('patients')
        .update({
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          date_of_birth: patient.date_of_birth,
          marital_status: patient.marital_status,
          education_level: patient.education_level,
          occupation: patient.occupation,
          blood_group: patient.blood_group,
          phone_number: patient.phone_number,
          address: patient.address,
          emergency_contact_name: patient.emergency_contact_name,
          emergency_contact_phone: patient.emergency_contact_phone,
          emergency_contact_relation: patient.emergency_contact_relation,
          medical_condition: patient.medical_condition,
          allergies: patient.allergies,
          current_medications: patient.current_medications,
          chronic_conditions: patient.chronic_conditions,
          family_history: patient.family_history,
          lifestyle_factors: patient.lifestyle_factors,
          area_code: patient.area_code,
          device_id: patient.device_id,
          updated_at: patient.updated_at,
          updated_at_cloud: new Date().toISOString(),
        })
        .eq('unique_id', patient.unique_id)
        .select();
      
      if (error) throw error;
      return data[0];
    } else {
      // Create new patient
      const { data, error } = await client
        .from('patients')
        .insert({
          unique_id: patient.unique_id,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          date_of_birth: patient.date_of_birth,
          marital_status: patient.marital_status,
          education_level: patient.education_level,
          occupation: patient.occupation,
          blood_group: patient.blood_group,
          phone_number: patient.phone_number,
          address: patient.address,
          emergency_contact_name: patient.emergency_contact_name,
          emergency_contact_phone: patient.emergency_contact_phone,
          emergency_contact_relation: patient.emergency_contact_relation,
          medical_condition: patient.medical_condition,
          allergies: patient.allergies,
          current_medications: patient.current_medications,
          chronic_conditions: patient.chronic_conditions,
          family_history: patient.family_history,
          lifestyle_factors: patient.lifestyle_factors,
          area_code: patient.area_code,
          device_id: patient.device_id,
          updated_at: patient.updated_at,
          created_at: patient.created_at,
        })
        .select();
      
      if (error) throw error;
      return data[0];
    }
  } catch (error) {
    console.error('Failed to sync patient to cloud:', error);
    throw error;
  }
}

// Batch sync patients
export async function batchSyncPatients(patients) {
  try {
    const client = await initializeSupabase();
    const results = [];
    
    for (const patient of patients) {
      try {
        const result = await syncPatientToCloud(patient);
        results.push({ success: true, patient: result });
      } catch (error) {
        results.push({ success: false, patient: patient.unique_id, error: error.message });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Batch sync failed:', error);
    throw error;
  }
}

// Delete patient from cloud
export async function deletePatientFromCloud(uniqueId) {
  try {
    const client = await initializeSupabase();
    const { error } = await client
      .from('patients')
      .delete()
      .eq('unique_id', uniqueId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to delete patient from cloud:', error);
    throw error;
  }
}

// Get patients from cloud (for conflict resolution)
export async function getPatientsFromCloud(uniqueIds = null) {
  try {
    const client = await initializeSupabase();
    let query = client.from('patients').select('*');
    
    if (uniqueIds && uniqueIds.length > 0) {
      query = query.in('unique_id', uniqueIds);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Failed to get patients from cloud:', error);
    throw error;
  }
}

// Sync logs
export async function addSyncLogToCloud(log) {
  try {
    const client = await initializeSupabase();
    const { data, error } = await client
      .from('sync_logs')
      .insert({
        device_id: log.device_id,
        patient_id: log.patient_id,
        action: log.action,
        timestamp: log.timestamp,
        status: log.status,
        error_message: log.error_message,
      })
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Failed to add sync log to cloud:', error);
    throw error;
  }
}

// Get dashboard statistics
export async function getDashboardStats() {
  try {
    const client = await initializeSupabase();
    
    // Get basic stats
    const { data: basicStats, error: basicError } = await client
      .from('patients')
      .select('gender, age, area_code, created_at_cloud');
    
    if (basicError) throw basicError;
    
    // Get area-wise stats
    const { data: areaStats, error: areaError } = await client
      .from('patients')
      .select('area_code, created_at_cloud')
      .order('area_code');
    
    if (areaError) throw areaError;
    
    // Process statistics
    const stats = {
      totalPatients: basicStats.length,
      maleCount: basicStats.filter(p => p.gender === 'male').length,
      femaleCount: basicStats.filter(p => p.gender === 'female').length,
      avgAge: basicStats.reduce((sum, p) => sum + (p.age || 0), 0) / basicStats.length,
      areaDistribution: {},
      recentActivity: basicStats
        .filter(p => p.created_at_cloud)
        .sort((a, b) => new Date(b.created_at_cloud) - new Date(a.created_at_cloud))
        .slice(0, 10)
    };
    
    // Calculate area distribution
    areaStats.forEach(patient => {
      const area = patient.area_code || 'Unknown';
      stats.areaDistribution[area] = (stats.areaDistribution[area] || 0) + 1;
    });
    
    return stats;
  } catch (error) {
    console.error('Failed to get dashboard stats:', error);
    throw error;
  }
}

// Get medical condition statistics
export async function getMedicalConditionStats() {
  try {
    const client = await initializeSupabase();
    const { data, error } = await client
      .from('patients')
      .select('medical_condition, area_code');
    
    if (error) throw error;
    
    const conditionStats = {};
    data.forEach(patient => {
      const condition = patient.medical_condition || 'Unknown';
      if (!conditionStats[condition]) {
        conditionStats[condition] = { total: 0, byArea: {} };
      }
      conditionStats[condition].total++;
      
      const area = patient.area_code || 'Unknown';
      conditionStats[condition].byArea[area] = (conditionStats[condition].byArea[area] || 0) + 1;
    });
    
    return conditionStats;
  } catch (error) {
    console.error('Failed to get medical condition stats:', error);
    throw error;
  }
} 