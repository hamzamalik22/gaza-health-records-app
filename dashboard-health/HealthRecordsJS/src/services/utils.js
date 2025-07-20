// Common utility functions for HealthRecordsJS

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

// Debounce: delays function execution until after wait ms have elapsed since last call
export function debounce(fn, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

// Throttle: ensures function is only called once every wait ms
export function throttle(fn, wait) {
  let inThrottle, lastFn, lastTime;
  return function () {
    const context = this,
      args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(function () {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
}

// Format date as YYYY-MM-DD
export function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

// Generate a UUID v4
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Default app settings
export const DEFAULT_APP_SETTINGS = {
  theme: 'light', // or 'dark'
  syncOnStartup: true,
  language: 'en',
};

// Get app settings (with defaults)
export async function getAppSettings() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.appSettings);
    return json ? { ...DEFAULT_APP_SETTINGS, ...JSON.parse(json) } : { ...DEFAULT_APP_SETTINGS };
  } catch (e) {
    return { ...DEFAULT_APP_SETTINGS };
  }
}

// Set all app settings
export async function setAppSettings(settings) {
  await AsyncStorage.setItem(STORAGE_KEYS.appSettings, JSON.stringify(settings));
}

// Update partial app settings
export async function updateAppSettings(partial) {
  const current = await getAppSettings();
  const updated = { ...current, ...partial };
  await setAppSettings(updated);
  return updated;
}
