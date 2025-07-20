import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { getPatients, getCloudSyncQueue, removeFromCloudSyncQueue, updateCloudSyncQueueRetry } from './database';
import { syncPatientToCloud, deletePatientFromCloud, addSyncLogToCloud } from './supabase';

let isConnected = false;
let syncInProgress = false;
let connectivityListeners = [];

// Monitor connectivity changes
export function startConnectivityMonitoring() {
  NetInfo.addEventListener(state => {
    const wasConnected = isConnected;
    isConnected = state.isConnected && state.isInternetReachable;
    
    // If connection was restored, trigger sync
    if (!wasConnected && isConnected) {
      console.log('Internet connection restored, triggering sync...');
      triggerAutoSync();
    }
    
    // Notify listeners
    connectivityListeners.forEach(listener => listener(isConnected));
  });
}

// Get current connectivity status
export function getConnectivityStatus() {
  return isConnected;
}

// Add connectivity listener
export function addConnectivityListener(listener) {
  connectivityListeners.push(listener);
  return () => {
    const index = connectivityListeners.indexOf(listener);
    if (index > -1) {
      connectivityListeners.splice(index, 1);
    }
  };
}

// Trigger automatic sync when connection is available
export async function triggerAutoSync() {
  if (!isConnected || syncInProgress) {
    return false;
  }
  
  try {
    syncInProgress = true;
    console.log('Starting automatic cloud sync...');
    
    // Get pending patients for sync
    const patients = await getPatients();
    const pendingPatients = patients.filter(p => p.cloud_sync_status === 'pending');
    
    console.log(`Auto sync: Found ${patients.length} total patients, ${pendingPatients.length} pending sync`);
    
    if (pendingPatients.length === 0) {
      console.log('No pending patients to sync');
      return true;
    }
    
    console.log(`Syncing ${pendingPatients.length} patients to cloud...`);
    
    // Sync each patient
    let successCount = 0;
    let errorCount = 0;
    
    for (const patient of pendingPatients) {
      try {
        await syncPatientToCloud(patient);
        successCount++;
        
        // Update local sync status
        await updatePatientSyncStatus(patient.unique_id, 'synced');
        
        // Log successful sync
        await addSyncLogToCloud({
          device_id: patient.device_id || 'unknown',
          patient_id: patient.unique_id,
          action: 'synced',
          timestamp: Date.now(),
          status: 'success',
        });
        
      } catch (error) {
        errorCount++;
        console.error(`Failed to sync patient ${patient.unique_id}:`, error);
        
        // Log failed sync
        await addSyncLogToCloud({
          device_id: patient.device_id || 'unknown',
          patient_id: patient.unique_id,
          action: 'sync_failed',
          timestamp: Date.now(),
          status: 'failed',
          error_message: error.message,
        });
      }
    }
    
    // Process cloud sync queue (for operations like deletes)
    await processCloudSyncQueue();
    
    // Update last sync time
    await AsyncStorage.setItem(STORAGE_KEYS.lastSyncTime, Date.now().toString());
    
    console.log(`Auto sync completed: ${successCount} successful, ${errorCount} failed`);
    return true;
    
  } catch (error) {
    console.error('Auto sync failed:', error);
    return false;
  } finally {
    syncInProgress = false;
  }
}

// Process cloud sync queue (for operations like deletes)
async function processCloudSyncQueue() {
  try {
    const queue = await getCloudSyncQueue();
    
    for (const item of queue) {
      try {
        if (item.operation === 'delete') {
          await deletePatientFromCloud(item.patient_id);
        } else if (item.operation === 'create' || item.operation === 'update') {
          await syncPatientToCloud(item.data);
        }
        
        // Remove from queue on success
        await removeFromCloudSyncQueue(item.id);
        
      } catch (error) {
        console.error(`Failed to process queue item ${item.id}:`, error);
        
        // Increment retry count
        const newRetryCount = (item.retry_count || 0) + 1;
        await updateCloudSyncQueueRetry(item.id, newRetryCount);
        
        // Remove from queue if too many retries
        if (newRetryCount >= 3) {
          await removeFromCloudSyncQueue(item.id);
        }
      }
    }
  } catch (error) {
    console.error('Failed to process cloud sync queue:', error);
  }
}

// Update patient sync status in local database
async function updatePatientSyncStatus(uniqueId, status) {
  try {
    const { updatePatient } = await import('./database');
    const patient = await getPatients().then(patients => 
      patients.find(p => p.unique_id === uniqueId)
    );
    
    if (patient) {
      await updatePatient({
        ...patient,
        cloud_sync_status: status,
        updated_at: Date.now(),
      });
    }
  } catch (error) {
    console.error('Failed to update patient sync status:', error);
  }
}

// Manual sync trigger
export async function manualSync() {
  if (!isConnected) {
    throw new Error('No internet connection available');
  }
  
  if (syncInProgress) {
    throw new Error('Sync already in progress');
  }
  
  // Get all patients to check if there are any to sync
  const patients = await getPatients();
  const pendingPatients = patients.filter(p => p.cloud_sync_status === 'pending');
  
  if (patients.length === 0) {
    throw new Error('No patients found in local database. Please add some patients first.');
  }
  
  if (pendingPatients.length === 0) {
    throw new Error('No pending patients to sync. All patients are already synced.');
  }
  
  console.log(`Manual sync: Found ${pendingPatients.length} patients to sync out of ${patients.length} total`);
  
  return await triggerAutoSync();
}

// Get sync status
export function getSyncStatus() {
  return {
    isConnected,
    syncInProgress,
    lastSyncTime: null, // Will be loaded from AsyncStorage when needed
  };
}

// Get last sync time
export async function getLastSyncTime() {
  try {
    const timestamp = await AsyncStorage.getItem(STORAGE_KEYS.lastSyncTime);
    return timestamp ? parseInt(timestamp) : null;
  } catch (error) {
    console.error('Failed to get last sync time:', error);
    return null;
  }
}

// Check if sync is needed
export async function isSyncNeeded() {
  try {
    const patients = await getPatients();
    const pendingPatients = patients.filter(p => p.cloud_sync_status === 'pending');
    const queue = await getCloudSyncQueue();
    
    return pendingPatients.length > 0 || queue.length > 0;
  } catch (error) {
    console.error('Failed to check if sync is needed:', error);
    return false;
  }
}

// Get sync statistics
export async function getSyncStats() {
  try {
    const patients = await getPatients();
    const totalPatients = patients.length;
    const syncedPatients = patients.filter(p => p.cloud_sync_status === 'synced').length;
    const pendingPatients = patients.filter(p => p.cloud_sync_status === 'pending').length;
    const queue = await getCloudSyncQueue();
    
    return {
      totalPatients,
      syncedPatients,
      pendingPatients,
      queueLength: queue.length,
      syncPercentage: totalPatients > 0 ? Math.round((syncedPatients / totalPatients) * 100) : 0,
    };
  } catch (error) {
    console.error('Failed to get sync stats:', error);
    return {
      totalPatients: 0,
      syncedPatients: 0,
      pendingPatients: 0,
      queueLength: 0,
      syncPercentage: 0,
    };
  }
} 