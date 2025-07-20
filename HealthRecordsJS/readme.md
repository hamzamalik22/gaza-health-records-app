Here's your **updated and complete project documentation** in a **single Markdown file** format, ready to feed into AI coding tools like **Cursor**, **Codex**, or **GPT-powered assistants** for code generation, implementation, or debugging.

---

````markdown
# 📱 Offline Health Record Management App (Android Only for Now)

> **Note:** This project currently targets **Android only**. iOS support will be considered in the future.

A lightweight React Native app (using JavaScript, not TypeScript) designed for health workers to **store, manage, and sync patient records offline**, even in **low-connectivity environments**. Features both Bluetooth-based peer-to-peer sync and **automatic cloud sync to Supabase PostgreSQL** for NGO dashboard capabilities.

---

## 🎯 Purpose

This app enables health workers to:
- **Store** comprehensive patient records offline (SQLite)
- **Update** information in real time with professional demographics
- **Share** data via Bluetooth with other devices
- **Auto-sync** to Supabase cloud when internet is available
- **Prevent duplicate entries** using intelligent sync
- **Work seamlessly** on low-end devices and offline zones
- **Enable NGO dashboards** for area health monitoring

---

## 🧱 Tech Stack

### Core Framework
- React Native (0.73+) — CLI version
- JavaScript

### Database & Storage
- `react-native-sqlite-storage` (Local)
- `@supabase/supabase-js` (Cloud PostgreSQL)
- `@react-native-async-storage/async-storage`

### Connectivity & Sync
- `react-native-ble-plx` (Bluetooth Low Energy)
- `@react-native-community/netinfo` (Internet connectivity monitoring)
- Automatic cloud sync with offline queue

### UI & Navigation
- `@react-navigation/native`, `@react-navigation/stack`
- `react-native-elements` (UI components)

### Debugging & Stability
- `npx react-native doctor`
- Stable versions of:
  - Android SDK: **34**
  - Build Tools: **34.0.0**
  - NDK: **25.1.8937393**
  - JDK: **11+**

---

## ⚙️ Android Configuration

### android/build.gradle
```gradle
buildscript {
    ext {
        buildToolsVersion = "34.0.0"
        minSdkVersion = 21
        compileSdkVersion = 34
        targetSdkVersion = 34
        ndkVersion = "25.1.8937393"
    }
}
```

### Android Permissions (`android/app/src/main/AndroidManifest.xml`)

```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

---

## 📦 Dependencies

### Runtime

```json
{
  "react": "18.2.0",
  "react-native": "0.73.0",
  "react-native-sqlite-storage": "^6.0.1",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "react-native-ble-plx": "^3.5.0",
  "@supabase/supabase-js": "^2.39.0",
  "@react-native-community/netinfo": "^11.4.1",
  "@react-navigation/native": "^6.1.18",
  "@react-navigation/stack": "^6.3.20",
  "react-native-elements": "^3.4.3",
  "react-native-safe-area-context": "^4.14.1",
  "react-native-screens": "~3.29.0"
}
```

---

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── PatientCard.js
│   ├── PatientForm.js    # Enhanced with comprehensive demographics
│   ├── SyncProgress.js
│   └── DeviceList.js
├── screens/              # App screens
│   ├── HomeScreen.js     # Enhanced with cloud sync
│   ├── PatientFormScreen.js
│   ├── PatientDetailScreen.js
│   ├── SyncScreen.js     # Bluetooth sync
│   └── SettingsScreen.js # Supabase configuration
├── services/             # Core logic
│   ├── database.js       # Enhanced SQLite schema
│   ├── bluetooth.js      # BLE sync
│   ├── supabase.js       # Cloud sync service
│   ├── connectivity.js   # Internet monitoring
│   ├── sync.js           # Legacy BLE sync
│   └── utils.js
├── navigation/           # Navigation config
│   └── AppNavigator.js
├── constants/            # App constants
│   └── index.js          # Enhanced demographics & area codes
```

---

## 🧾 Enhanced Data Models

### Patient Schema (Professional Healthcare)

```js
{
  unique_id: string,          // UUID v4
  name: string,               // Full name
  age: number,                // Age in years
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say',
  date_of_birth: string,      // YYYY-MM-DD format
  marital_status: string,     // single, married, divorced, etc.
  education_level: string,    // none, primary, secondary, etc.
  occupation: string,         // unemployed, student, farmer, etc.
  blood_group: string,        // A+, B-, O+, etc.
  phone_number: string,       // Contact number
  address: string,            // Residential address
  
  // Emergency Contact
  emergency_contact_name: string,
  emergency_contact_phone: string,
  emergency_contact_relation: string,
  
  // Medical Information
  medical_condition: string,  // Primary condition
  allergies: string,          // Known allergies
  current_medications: string, // Current medications
  chronic_conditions: string, // Chronic health issues
  family_history: string,     // Family medical history
  lifestyle_factors: string,  // Smoking, exercise, etc.
  
  // Administrative
  area_code: string,          // For NGO dashboard
  device_id: string,          // Source device
  updated_at: number,         // Unix timestamp
  created_at: number,
  sync_status: 'local' | 'synced' | 'pending',
  cloud_sync_status: 'pending' | 'synced' | 'failed'
}
```

### Sync Log Schema

```js
{
  id: string,
  device_id: string,
  patient_id: string,
  action: 'sent' | 'received' | 'updated' | 'synced' | 'sync_failed',
  timestamp: number,
  status: 'success' | 'failed',
  error_message: string
}
```

---

## ⚡️ Installation & Running

### 1. Initialize Project

```bash
npx react-native init HealthRecordsJS
cd HealthRecordsJS
```

### 2. Install Dependencies

```bash
yarn add react-native-sqlite-storage @react-native-async-storage/async-storage react-native-ble-plx @supabase/supabase-js @react-native-community/netinfo @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context react-native-elements
```

### 3. Link Native Modules

> **Android Only:** No need to run `npx pod-install` unless you add iOS support in the future.

### 4. Diagnose Setup

```bash
npx react-native doctor
```

### 5. Run App

```bash
yarn android
```

---

## 🖼️ Screens Overview

1. **HomeScreen** – Enhanced patient list with cloud sync status, search, manual sync
2. **PatientFormScreen** – Comprehensive patient form with professional demographics
3. **PatientDetailScreen** – Full patient profile and edit/delete
4. **SyncScreen** – Bluetooth scan, connect, sync logs
5. **SettingsScreen** – Supabase configuration, area code, sync statistics

---

## 🔗 Sync Protocols

### Bluetooth Sync
* BLE-based using `react-native-ble-plx`
* UUID-based service + characteristics
* Chunked data transmission
* Retry mechanism
* Conflict resolution via timestamp comparison

### Cloud Sync (Supabase)
* Automatic sync when internet available
* Offline queue for failed operations
* Batch processing for efficiency
* Conflict resolution via timestamps
* Comprehensive sync logging

---

## 📊 NGO Dashboard Features

### Area-Based Analytics
- Patient count by geographic area
- Medical condition statistics
- Gender and age distribution
- Sync status monitoring
- Recent activity tracking

### Real-Time Monitoring
- Live patient registration
- Medical condition trends
- Device sync status
- Data quality metrics

---

## 💡 Performance Optimization

* **Hermes enabled** for bundle size reduction
* **Lazy loading** & **virtualized lists** for large datasets
* **Indexed SQLite queries**
* **ProGuard** enabled in release mode
* **Batch cloud sync** for efficiency
* Optimized for 1GB RAM devices

---

## ✅ Testing Strategy

### Unit Tests (Jest)

* SQLite database operations
* Supabase cloud sync
* Sync logic with mock connectivity
* Utility functions

### Integration Tests

* End-to-end sync between devices
* Cloud sync with Supabase
* App behavior after restart
* Offline & reconnect scenarios

### Manual Device Testing

* Devices with 1–2 GB RAM
* No internet connection test
* Battery and memory profiling
* Cloud sync performance

---

## 🔧 Debug Tips

* Always run:

```bash
npx react-native doctor
```

* If APK crashes:

  * Ensure NDK version is **exact match**: `25.1.8937393`
  * Clear Gradle cache: `./gradlew clean`
  * Reset Metro cache:

    ```bash
    npx react-native start --reset-cache
    ```

* Emulator slow/crashes?

  * Set **2GB RAM**, cold boot
  * Use **x86\_64 ABI**, not arm64
  * Disable "Snapshot" option

* Cloud sync issues:

  * Check Supabase configuration in Settings
  * Verify internet connectivity
  * Check sync logs for errors
  * Test connection in Settings

---

## 📋 Success Criteria

| Requirement           | Goal                                  |
| --------------------- | ------------------------------------- |
| Store locally         | ✅ 1000+ records in SQLite             |
| Bluetooth sync        | ✅ Sync between 2+ devices             |
| Cloud sync           | ✅ Auto-sync to Supabase PostgreSQL    |
| Offline functionality | ✅ Works without internet              |
| Professional data     | ✅ Comprehensive patient demographics  |
| NGO dashboard        | ✅ Area-based analytics & monitoring   |
| APK size              | ✅ < 25MB                              |
| App startup time      | ✅ < 3 seconds                         |
| Sync speed            | ✅ 100 records in < 30 seconds         |
| Usability             | ✅ No training needed for health staff |

---

## 🚀 Supabase Setup

For cloud sync functionality, follow the detailed setup guide in `SUPABASE_SETUP.md`:

1. **Create Supabase project**
2. **Run database schema**
3. **Configure API keys**
4. **Set area codes**
5. **Test connectivity**

---

**Note**: This enhanced version includes professional healthcare demographics, automatic cloud sync to Supabase PostgreSQL, and NGO dashboard capabilities while maintaining offline-first functionality for low-connectivity environments.
