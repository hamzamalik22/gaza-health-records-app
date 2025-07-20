import { BleManager } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import { Buffer } from 'buffer';
import { BLE } from '../constants';

const bleManager = new BleManager();

export async function requestPermissions() {
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  }
}

export function startScan(onDeviceFound, onScanEnd) {
  requestPermissions().then(() => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        onScanEnd && onScanEnd(error);
        return;
      }
      if (device && onDeviceFound) {
        onDeviceFound(device);
      }
    });
    // Stop scan after 10 seconds
    setTimeout(() => {
      bleManager.stopDeviceScan();
      onScanEnd && onScanEnd();
    }, 10000);
  });
}

export function stopScan() {
  bleManager.stopDeviceScan();
}

export async function connectToDevice(deviceId) {
  try {
    const device = await bleManager.connectToDevice(deviceId);
    await device.discoverAllServicesAndCharacteristics();
    return device;
  } catch (e) {
    throw e;
  }
}

// Helper: chunk a string into array of maxLength
function chunkString(str, maxLength) {
  const chunks = [];
  let i = 0;
  while (i < str.length) {
    chunks.push(str.slice(i, i + maxLength));
    i += maxLength;
  }
  return chunks;
}

// Send JSON data over BLE in chunks
export async function sendJsonOverBle(device, jsonObj, onProgress) {
  const serviceUUID = BLE.SERVICE_UUID;
  const charUUID = BLE.CHARACTERISTIC_UUID;
  const jsonStr = JSON.stringify(jsonObj);
  const chunkSize = 180; // BLE safe size (<= 180 bytes for most devices)
  const chunks = chunkString(jsonStr, chunkSize);
  for (let i = 0; i < chunks.length; i++) {
    const base64Chunk = Buffer.from(chunks[i]).toString('base64');
    await device.writeCharacteristicWithResponseForService(serviceUUID, charUUID, base64Chunk);
    if (onProgress) onProgress(Math.round(((i + 1) / chunks.length) * 100));
  }
}

// Receive JSON data over BLE (reassembles chunks)
export async function receiveJsonOverBle(device, onData, onComplete) {
  const serviceUUID = BLE.SERVICE_UUID;
  const charUUID = BLE.CHARACTERISTIC_UUID;
  let received = '';
  // Subscribe to notifications
  await device.monitorCharacteristicForService(serviceUUID, charUUID, (error, characteristic) => {
    if (error) {
      if (onComplete) onComplete(error, null);
      return;
    }
    const chunk = Buffer.from(characteristic.value, 'base64').toString('utf8');
    received += chunk;
    if (onData) onData(chunk);
    // Simple protocol: sender sends 'END' as last chunk
    if (chunk.endsWith('END')) {
      const jsonStr = received.replace(/END$/, '');
      try {
        const jsonObj = JSON.parse(jsonStr);
        if (onComplete) onComplete(null, jsonObj);
      } catch (e) {
        if (onComplete) onComplete(e, null);
      }
    }
  });
}

// Stub for chunked data transmission
export async function sendDataChunked(device, data, onProgress) {
  // Append 'END' to signal end of transmission
  const dataWithEnd = { ...data, _end: 'END' };
  await sendJsonOverBle(device, dataWithEnd, onProgress);
}

// Stub for retry and conflict resolution
export function handleSyncRetry() {
  // TODO: Implement retry logic
}

export function resolveConflicts() {
  // TODO: Implement conflict resolution
}
