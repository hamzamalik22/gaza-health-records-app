// Core sync logic for Bluetooth and offline-first
// This file coordinates data sync, chunking, retry, conflict resolution, and logging

import { addSyncLog } from './database';
import { sendDataChunked } from './bluetooth';
import { getPatients, addPatient } from './database';

// Chunked data transmission
export async function syncDataChunked(device, data, onProgress) {
  // TODO: Split data into chunks and send via BLE
  // Call onProgress(percent) as chunks are sent
  await sendDataChunked(device, data);
  // Log sync
  await addSyncLog({
    id: Math.random().toString(36).substr(2, 9),
    device_id: device.id,
    patient_id: null,
    action: 'sent',
    timestamp: Date.now(),
    status: 'success',
  });
}

// Retry and error handling
export async function syncWithRetry(device, data, maxRetries = 3) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      await syncDataChunked(device, data);
      return true;
    } catch (e) {
      attempt++;
      if (attempt >= maxRetries) throw e;
      await new Promise(res => setTimeout(res, 1000 * attempt)); // Exponential backoff
    }
  }
}

// Conflict resolution (timestamp-based)
export function resolveSyncConflicts(localRecord, remoteRecord) {
  // Returns the latest record based on updated_at
  if (!localRecord) return remoteRecord;
  if (!remoteRecord) return localRecord;
  return localRecord.updated_at > remoteRecord.updated_at ? localRecord : remoteRecord;
}

// Prevent duplicate entries
export function isDuplicate(localList, incomingRecord) {
  return localList.some(r => r.unique_id === incomingRecord.unique_id);
}

// Offline-first and retry queue
const retryQueue = [];

export function queueSync(device, data) {
  retryQueue.push({ device, data });
}

export async function processRetryQueue() {
  while (retryQueue.length > 0) {
    const { device, data } = retryQueue.shift();
    try {
      await syncWithRetry(device, data);
    } catch (e) {
      // If still fails, requeue
      retryQueue.push({ device, data });
      break;
    }
  }
}

// Add sync log entry
export async function logSync(deviceId, patientId, action, status) {
  await addSyncLog({
    id: Math.random().toString(36).substr(2, 9),
    device_id: deviceId,
    patient_id: patientId,
    action,
    timestamp: Date.now(),
    status,
  });
}

// Merge received patient JSON into database, ignoring duplicates
export async function importAndMergePatientsFromJson(json) {
  const incoming = Array.isArray(json) ? json : (json.patients || []);
  const local = await getPatients();
  const localIds = new Set(local.map(p => p.unique_id));
  let added = 0;
  for (const patient of incoming) {
    if (!localIds.has(patient.unique_id)) {
      await addPatient(patient);
      added++;
    }
  }
  return added;
}
