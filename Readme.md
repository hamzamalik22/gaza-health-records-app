# Medical Record System - GAZA

A modern, professional mobile application for healthcare teams to efficiently manage patient health records—**offline and online**. Built with React Native, it empowers clinics, hospitals, and field teams to deliver better care, even in low-connectivity environments.

---

## 🚀 Features

- **Patient Management:** Add, edit, and view detailed patient profiles with medical-focused forms.
- **Offline-First:** Store patient data securely on-device (SQLite); works fully offline.
- **Cloud Sync:** Syncs with Supabase cloud backend when internet is available.
- **Bluetooth Sync:** Peer-to-peer data sharing via Bluetooth (BLE).
- **Professional Dashboard:** Visual stats, search/filter, and quick patient actions.
- **Medical Data Focus:** Captures demographics, conditions, allergies, medications, and more.
- **Modern UI:** Clean, accessible, and responsive design.

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
   git clone <your-repo-url>
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

---

## 📄 License

MIT

---

**For detailed Supabase setup and advanced configuration, see [`HealthRecordsJS/SUPABASE_SETUP.md`](./HealthRecordsJS/SUPABASE_SETUP.md).** 