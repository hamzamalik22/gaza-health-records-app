# 🗂️ Project Plan: Offline Health Record Management App (Android Only for Now)

> **Note:** This plan currently targets **Android only**. iOS support will be considered in the future.

This plan breaks down the development of the Offline Health Record Management App into actionable tasks, grouped by feature and technical area. Each task includes a progress tracker (☐ = not started, 🟡 = in progress, ✅ = complete). Update this file as you work!

---

## 1. 📦 Project Setup
- [x] ✅ Initialize React Native project (CLI, JS)
- [x] ✅ Install dependencies (see readme)
- [x] ✅ Configure Android build tools, SDK, NDK, JDK
- [x] ✅ Set up Android permissions (Bluetooth, storage, location)
- [ ] ☐ Link native modules (for iOS, run `npx pod-install` in the future if iOS support is added)
- [x] ✅ Enable Hermes
- [ ] ☐ Enable ProGuard

## 2. 📁 Project Structure & Boilerplate
- [x] ✅ Create directory structure (`src/components`, `src/screens`, etc.)
- [x] ✅ Set up navigation (custom state-based navigation in App.tsx)
- [ ] ☐ Add constants and utility files

## 3. 🗄️ Database Layer
- [x] ✅ Implement SQLite database service (`database.js`)
- [x] ✅ Define Patient schema and CRUD operations
- [x] ✅ Implement Sync Log schema and operations
- [🟡] 🟡 Add AsyncStorage for app settings (used for device name, not full settings)

## 4. 📱 UI Components
- [x] ✅ PatientCard (list item)
- [x] ✅ PatientForm (add/edit form)
- [x] ✅ SyncProgress (sync status)
- [🟡] 🟡 DeviceList (Bluetooth devices, partially implemented in SyncScreen)

## 5. 🖼️ Screens
- [x] ✅ HomeScreen (patient list, search, sync indicators)
- [x] ✅ PatientFormScreen (add/edit patient, handled as modal or inline)
- [x] ✅ PatientDetailScreen (profile, edit/delete)
- [x] ✅ SyncScreen (Bluetooth scan, connect, logs)
- [x] ✅ SettingsScreen (device config, export/import, version)

## 6. 🔗 Bluetooth Sync
- [🟡] 🟡 Implement BLE service/characteristics (`bluetooth.js`)
- [🟡] 🟡 Device discovery and connection
- [🟡] 🟡 Chunked data transmission
- [🟡] 🟡 Retry and error handling
- [🟡] 🟡 Conflict resolution (timestamp-based)
- [🟡] 🟡 Sync log entries for all transactions

## 7. 🔄 Sync Logic
- [🟡] 🟡 Core sync logic (`sync.js`)
- [🟡] 🟡 Prevent duplicate entries
- [🟡] 🟡 Offline-first and retry queue

## 8. ⚡️ Performance Optimization
- [x] ✅ Enable Hermes
- [x] ✅ Use virtualized lists for patients
- [ ] ☐ Optimize SQLite queries
- [ ] ☐ ProGuard for release builds

## 9. ✅ Testing
- [ ] ☐ Unit tests (Jest) for DB, sync, utils
- [ ] ☐ Integration tests (sync, offline, restart)
- [ ] ☐ Manual device testing (low RAM, no internet)

## 10. 📝 Documentation & Success Criteria
- [🟡] 🟡 Update README with usage, troubleshooting (README is detailed, but success criteria not fully validated)
- [ ] ☐ Ensure all success criteria are met (see table in readme)

---

## 📊 Progress Tracking Example

| Task                                   | Status   | Notes                |
| --------------------------------------- | -------- | -------------------- |
| Project initialized                     | ✅        |                      |
| Database layer complete                 | ✅        |                      |
| Bluetooth sync implemented              | 🟡        | Basic sync, in progress |
| 1000+ records tested                    | ☐        |                      |
| Sync between 2+ devices                 | ☐        |                      |
| APK size < 20MB                         | ☐        |                      |
| App startup < 3s                        | ☐        |                      |
| No training needed for health staff     | ☐        |                      |

---

**Update this file as you progress! Change ☐ to 🟡 when in progress, and to ✅ when complete. Add notes for blockers or important findings.** 