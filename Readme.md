# Medical Record System - GAZA

A modern, professional mobile application for healthcare teams to efficiently manage patient health records—**offline and online**. Built with React Native, it empowers clinics, hospitals, and field teams to deliver better care, even in low-connectivity environments.

---

## 📝 Feature Details

### 1. Offline-First Mobile App

**What it is:**  
A mobile application (built with React Native) that works **entirely offline**. All patient records are stored locally on the device using SQLite, so healthcare workers can continue their work even if there’s no internet or power.

**How it works:**
- **Local Database:** Patient data is saved in a local SQLite database on the device.
- **No Connectivity Needed:** Doctors and nurses can add, edit, and view patient records without any network connection.
- **Resilient UI:** The app’s interface is designed to be fast, simple, and usable even in stressful, low-light, or emergency conditions.
- **Automatic Sync:** When the device later connects to the internet, all new or updated records are automatically queued for cloud sync (see Feature 3).

**Why it matters for Gaza:**  
Power and internet outages are common. This feature ensures that medical teams can always access and update records, no matter the situation.

---

### 2. Bluetooth Sharing

**What it is:**  
A peer-to-peer data sharing system using Bluetooth Low Energy (BLE). When traditional networks are down, devices can exchange patient records directly with each other.

**How it works:**
- **BLE Sync:** Devices scan for each other and connect using Bluetooth.
- **Record Exchange:** Patient records are securely transferred between devices, even in the absence of WiFi or cellular networks.
- **Conflict Resolution:** The app uses timestamps to resolve which record is the latest if the same patient exists on both devices.
- **Inspired by Gaza’s Resilience:** This system is modeled after the creative, underground communication methods used in Gaza, ensuring information can still flow when infrastructure is damaged.

**Why it matters for Gaza:**  
When infrastructure is destroyed, this feature allows field teams to keep their data in sync and coordinate care, even in the most challenging conditions.

---

### 3. Cloud Sync (Supabase)

**What it is:**  
Automatic, secure synchronization of patient records to a cloud database (Supabase) whenever internet access is available.

**How it works:**
- **Background Sync:** The app detects when the device is online and automatically uploads new or updated records to the cloud.
- **Encryption & Security:** All data is encrypted during transfer. Security keys are kept hidden and never exposed in the app.
- **Offline Queue:** If the internet is lost during sync, the app queues the data and retries when connectivity returns.
- **Supabase Backend:** Supabase provides a scalable, secure PostgreSQL database and API for storing and managing patient data.

**Why it matters for Gaza:**  
Even brief moments of connectivity (e.g., via satellite or restored networks) are enough to sync critical data, ensuring that records are safely backed up and accessible to authorized teams.

---

### 4. NGO Dashboard

**What it is:**  
A web-based dashboard for NGOs and medical coordinators to view real-time patient data, sync status, and on-ground needs.

**How it works:**
- **Data Fetching:** The dashboard connects to the Supabase cloud backend to fetch the latest synced patient records.
- **Analytics & Stats:** Provides visualizations of patient counts, medical conditions, sync status, and geographic distribution.
- **Real-Time Monitoring:** Enables NGOs to track needs, allocate resources, and respond quickly to changing situations in Gaza.
- **Secure Access:** Only authorized users can view sensitive data, maintaining patient privacy.

**Why it matters for Gaza:**  
NGOs and medical teams get a live, accurate picture of health needs and resource gaps, helping them coordinate aid and medical response more effectively.

---

## 👩‍⚕️ Who Is It For?

- Doctors, nurses, and medical staff in clinics, hospitals, and field operations.
- NGOs and organizations needing reliable, portable health record management.
- Teams working in low-connectivity or emergency environments.

---

## 🧱 Tech Stack

- **React Native** (cross-platform mobile)
- **SQLite** (local storage)
- **Supabase** (cloud backend)
- **Bluetooth BLE** (`react-native-ble-plx`)
- **Modern UI libraries** (`react-native-elements`, etc.)

---

## 📁 Project Structure

```
src/
├── components/      # UI components (PatientCard, PatientForm, SyncProgress, DeviceList)
├── screens/         # App screens (Home, PatientForm, PatientDetail, Sync, Settings)
├── services/        # Core logic (database, bluetooth, supabase, connectivity, sync, utils)
├── navigation/      # Navigation config
├── constants/       # App constants (demographics, area codes)
```

---

## 🗄️ Data Models

### Patient

```js
{
  unique_id: string, name: string, age: number, gender: string, date_of_birth: string,
  marital_status: string, education_level: string, occupation: string, blood_group: string,
  phone_number: string, address: string,
  emergency_contact_name: string, emergency_contact_phone: string, emergency_contact_relation: string,
  medical_condition: string, allergies: string, current_medications: string, chronic_conditions: string,
  family_history: string, lifestyle_factors: string,
  area_code: string, device_id: string, updated_at: number, created_at: number,
  sync_status: 'local' | 'synced' | 'pending', cloud_sync_status: 'pending' | 'synced' | 'failed'
}
```

### Sync Log

```js
{
  id: string, device_id: string, patient_id: string,
  action: 'sent' | 'received' | 'updated' | 'synced' | 'sync_failed',
  timestamp: number, status: 'success' | 'failed', error_message: string
}
```

---

## 🔗 Sync Protocols

- **Bluetooth Sync:** BLE-based, chunked data transfer, timestamp-based conflict resolution.
- **Cloud Sync (Supabase):** Automatic when online, offline queue, batch processing, robust logging.

---

## ⚡️ Installation & Running

1. **Clone the repo:**
   ```bash
   git clone https://github.com/hamzamalik22/gaza-health-records-app.git
   cd HealthRecordsJS
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Android setup:**  
   Ensure Android SDK 34, NDK 25.1.8937393, and JDK 11+ are installed.

4. **Run the app:**
   ```bash
   yarn android
   ```

5. **Supabase setup:**  
   See [`SUPABASE_SETUP.md`](./HealthRecordsJS/SUPABASE_SETUP.md) for cloud sync configuration.

---

## 🖼️ Screens Overview

- **HomeScreen:** Patient list, search, sync status, manual sync.
- **PatientFormScreen:** Add/edit patient with full demographics.
- **PatientDetailScreen:** View/edit patient profile.
- **SyncScreen:** Bluetooth scan/connect, sync logs.
- **SettingsScreen:** Supabase config, area code, sync stats.

---

## 📋 Success Criteria

| Requirement           | Goal                                  |
| --------------------- | ------------------------------------- |
| Store locally         | ✅ 1000+ records in SQLite             |
| Bluetooth sync        | ✅ Sync between 2+ devices             |
| Cloud sync            | ✅ Auto-sync to Supabase PostgreSQL    |
| Offline functionality | ✅ Works without internet              |
| Professional data     | ✅ Comprehensive patient demographics  |
| NGO dashboard         | ✅ Area-based analytics & monitoring   |
| APK size              | ✅ < 25MB                              |
| App startup time      | ✅ < 3 seconds                         |
| Sync speed            | ✅ 100 records in < 30 seconds         |
| Usability             | ✅ No training needed for health staff |

---

## 🧪 Testing

- **Unit tests:** SQLite, Supabase sync, sync logic, utilities (Jest).
- **Integration tests:** Device-to-device sync, cloud sync, offline/reconnect.
- **Manual:** Low-RAM devices, no internet, battery/memory profiling.

---

## 🛠️ Troubleshooting

- Run `npx react-native doctor` for environment checks.
- For build issues, ensure NDK and SDK versions match.
- For sync issues, check Supabase config and logs in Settings.

---

## 📊 NGO Dashboard

- Area-based analytics, medical condition stats, gender/age distribution, sync status, and more (see Supabase dashboard).

