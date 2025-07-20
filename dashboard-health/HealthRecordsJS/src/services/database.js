import SQLite from 'react-native-sqlite-storage';

// Enable debug for development
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const DB_NAME = 'healthrecords.db';
const DB_VERSION = '1.0';
const DB_DISPLAYNAME = 'Health Records Database';
const DB_SIZE = 200000;

let db;

export async function openDatabase() {
  if (db) return db;
  db = await SQLite.openDatabase({
    name: DB_NAME,
    location: 'default',
  });
  await createTables();
  return db;
}

async function createTables() {
  // Check if patients table exists and has correct schema
  try {
    console.log('Checking patients table schema...');
    const [results] = await db.executeSql("PRAGMA table_info(patients);");
    const columns = [];
    for (let i = 0; i < results.rows.length; i++) {
      columns.push(results.rows.item(i).name);
    }
    
    console.log('Current columns:', columns);
    
    // Check if all required columns exist
    const requiredColumns = [
      'unique_id', 'name', 'age', 'gender', 'date_of_birth', 'marital_status',
      'education_level', 'occupation', 'blood_group', 'phone_number', 'address',
      'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relation',
      'medical_condition', 'allergies', 'current_medications', 'chronic_conditions',
      'family_history', 'lifestyle_factors', 'area_code', 'device_id',
      'updated_at', 'created_at', 'sync_status', 'cloud_sync_status'
    ];
    
    const missingColumns = requiredColumns.filter(col => !columns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('Missing columns:', missingColumns);
      console.log('Dropping and recreating patients table...');
      
      // Close any existing connections and drop table
      await db.executeSql('DROP TABLE IF EXISTS patients;');
      
      // Enhanced patients table matching Supabase schema
      await db.executeSql(`CREATE TABLE patients (
        unique_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        date_of_birth TEXT,
        marital_status TEXT,
        education_level TEXT,
        occupation TEXT,
        blood_group TEXT,
        phone_number TEXT,
        address TEXT,
        emergency_contact_name TEXT,
        emergency_contact_phone TEXT,
        emergency_contact_relation TEXT,
        medical_condition TEXT,
        allergies TEXT,
        current_medications TEXT,
        chronic_conditions TEXT,
        family_history TEXT,
        lifestyle_factors TEXT,
        area_code TEXT,
        device_id TEXT,
        updated_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        sync_status TEXT DEFAULT 'local',
        cloud_sync_status TEXT DEFAULT 'pending'
      );`);
      
      console.log('Patients table recreated with correct schema');
    } else {
      console.log('Patients table already has correct schema');
    }
  } catch (error) {
    console.log('Table does not exist, creating new table...');
    
  // Enhanced patients table with comprehensive demographics
    await db.executeSql(`CREATE TABLE patients (
    unique_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    date_of_birth TEXT,
    marital_status TEXT,
    education_level TEXT,
    occupation TEXT,
    blood_group TEXT,
    phone_number TEXT,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relation TEXT,
    
    -- Medical Information
    medical_condition TEXT,
    allergies TEXT,
    current_medications TEXT,
    chronic_conditions TEXT,
    family_history TEXT,
    lifestyle_factors TEXT,
    
    -- Administrative
    area_code TEXT,
    device_id TEXT,
    updated_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    sync_status TEXT DEFAULT 'local',
    cloud_sync_status TEXT DEFAULT 'pending'
  );`);

    console.log('Patients table created with correct schema');
  }
  
      // Sync logs for tracking (matching Supabase schema)
  await db.executeSql(`CREATE TABLE IF NOT EXISTS sync_logs (
    id TEXT PRIMARY KEY,
      device_id TEXT NOT NULL,
      patient_id TEXT NOT NULL,
      action TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      status TEXT NOT NULL,
    error_message TEXT
  );`);

  // Cloud sync queue for offline operations
  await db.executeSql(`CREATE TABLE IF NOT EXISTS cloud_sync_queue (
    id TEXT PRIMARY KEY,
    patient_id TEXT,
    operation TEXT, -- 'create', 'update', 'delete'
    data TEXT, -- JSON string of patient data
    timestamp INTEGER,
    retry_count INTEGER DEFAULT 0
  );`);
}

// Migrate existing table schema if needed
async function migrateTable() {
  try {
    console.log('Starting database migration...');
    
    // Check if date_of_birth column exists
    const [results] = await db.executeSql("PRAGMA table_info(patients);");
    const columns = [];
    for (let i = 0; i < results.rows.length; i++) {
      columns.push(results.rows.item(i).name);
    }
    
    console.log('Current columns in patients table:', columns);
    
    // Add missing columns if they don't exist
    if (!columns.includes('date_of_birth')) {
      console.log('Adding date_of_birth column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN date_of_birth TEXT;');
    }
    
    if (!columns.includes('marital_status')) {
      console.log('Adding marital_status column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN marital_status TEXT;');
    }
    
    if (!columns.includes('education_level')) {
      console.log('Adding education_level column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN education_level TEXT;');
    }
    
    if (!columns.includes('occupation')) {
      console.log('Adding occupation column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN occupation TEXT;');
    }
    
    if (!columns.includes('blood_group')) {
      console.log('Adding blood_group column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN blood_group TEXT;');
    }
    
    if (!columns.includes('emergency_contact_name')) {
      console.log('Adding emergency_contact_name column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN emergency_contact_name TEXT;');
    }
    
    if (!columns.includes('emergency_contact_phone')) {
      console.log('Adding emergency_contact_phone column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN emergency_contact_phone TEXT;');
    }
    
    if (!columns.includes('emergency_contact_relation')) {
      console.log('Adding emergency_contact_relation column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN emergency_contact_relation TEXT;');
    }
    
    if (!columns.includes('medical_condition')) {
      console.log('Adding medical_condition column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN medical_condition TEXT;');
    }
    
    if (!columns.includes('allergies')) {
      console.log('Adding allergies column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN allergies TEXT;');
    }
    
    if (!columns.includes('current_medications')) {
      console.log('Adding current_medications column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN current_medications TEXT;');
    }
    
    if (!columns.includes('chronic_conditions')) {
      console.log('Adding chronic_conditions column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN chronic_conditions TEXT;');
    }
    
    if (!columns.includes('family_history')) {
      console.log('Adding family_history column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN family_history TEXT;');
    }
    
    if (!columns.includes('lifestyle_factors')) {
      console.log('Adding lifestyle_factors column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN lifestyle_factors TEXT;');
    }
    
    if (!columns.includes('area_code')) {
      console.log('Adding area_code column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN area_code TEXT;');
    }
    
    if (!columns.includes('device_id')) {
      console.log('Adding device_id column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN device_id TEXT;');
    }
    
    if (!columns.includes('sync_status')) {
      console.log('Adding sync_status column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN sync_status TEXT DEFAULT "local";');
    }
    
    if (!columns.includes('cloud_sync_status')) {
      console.log('Adding cloud_sync_status column to patients table...');
      await db.executeSql('ALTER TABLE patients ADD COLUMN cloud_sync_status TEXT DEFAULT "pending";');
    }
    
    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Database migration failed:', error);
  }
}

// --- Enhanced Patient CRUD ---
export async function addPatient(patient) {
  try {
    console.log('addPatient called with:', patient);
    
  const {
    unique_id, name, age, gender, date_of_birth, marital_status, education_level,
    occupation, blood_group, phone_number, address, emergency_contact_name,
    emergency_contact_phone, emergency_contact_relation, medical_condition,
    allergies, current_medications, chronic_conditions, family_history,
    lifestyle_factors, area_code, device_id, updated_at, created_at,
    sync_status, cloud_sync_status
  } = patient;
  
  await openDatabase();
    console.log('Database opened, executing SQL...');
    
    const result = await db.executeSql(
    `INSERT OR REPLACE INTO patients (
      unique_id, name, age, gender, date_of_birth, marital_status, education_level,
      occupation, blood_group, phone_number, address, emergency_contact_name,
      emergency_contact_phone, emergency_contact_relation, medical_condition,
      allergies, current_medications, chronic_conditions, family_history,
      lifestyle_factors, area_code, device_id, updated_at, created_at,
      sync_status, cloud_sync_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [unique_id, name, age, gender, date_of_birth, marital_status, education_level,
     occupation, blood_group, phone_number, address, emergency_contact_name,
     emergency_contact_phone, emergency_contact_relation, medical_condition,
     allergies, current_medications, chronic_conditions, family_history,
     lifestyle_factors, area_code, device_id, updated_at, created_at,
     sync_status, cloud_sync_status]
  );
    
    console.log('SQL executed successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in addPatient:', error);
    throw error;
  }
}

export async function getPatients() {
  await openDatabase();
  const [results] = await db.executeSql('SELECT * FROM patients ORDER BY updated_at DESC;');
  let patients = [];
  for (let i = 0; i < results.rows.length; i++) {
    patients.push(results.rows.item(i));
  }
  return patients;
}

export async function getPatientById(unique_id) {
  await openDatabase();
  const [results] = await db.executeSql('SELECT * FROM patients WHERE unique_id = ?;', [unique_id]);
  if (results.rows.length > 0) {
    return results.rows.item(0);
  }
  return null;
}

export async function updatePatient(patient) {
  const {
    unique_id, name, age, gender, date_of_birth, marital_status, education_level,
    occupation, blood_group, phone_number, address, emergency_contact_name,
    emergency_contact_phone, emergency_contact_relation, medical_condition,
    allergies, current_medications, chronic_conditions, family_history,
    lifestyle_factors, area_code, updated_at, sync_status, cloud_sync_status
  } = patient;
  
  await openDatabase();
  return db.executeSql(
    `UPDATE patients SET 
      name=?, age=?, gender=?, date_of_birth=?, marital_status=?, education_level=?,
      occupation=?, blood_group=?, phone_number=?, address=?, emergency_contact_name=?,
      emergency_contact_phone=?, emergency_contact_relation=?, medical_condition=?,
      allergies=?, current_medications=?, chronic_conditions=?, family_history=?,
      lifestyle_factors=?, area_code=?, updated_at=?, sync_status=?, cloud_sync_status=?
      WHERE unique_id=?;`,
    [name, age, gender, date_of_birth, marital_status, education_level,
     occupation, blood_group, phone_number, address, emergency_contact_name,
     emergency_contact_phone, emergency_contact_relation, medical_condition,
     allergies, current_medications, chronic_conditions, family_history,
     lifestyle_factors, area_code, updated_at, sync_status, cloud_sync_status, unique_id]
  );
}

export async function deletePatient(unique_id) {
  await openDatabase();
  return db.executeSql('DELETE FROM patients WHERE unique_id=?;', [unique_id]);
}

// --- Cloud Sync Queue Operations ---
export async function addToCloudSyncQueue(patientId, operation, data) {
  await openDatabase();
  const id = Math.random().toString(36).substr(2, 9);
  return db.executeSql(
    `INSERT OR REPLACE INTO cloud_sync_queue (id, patient_id, operation, data, timestamp) VALUES (?, ?, ?, ?, ?);`,
    [id, patientId, operation, JSON.stringify(data), Date.now()]
  );
}

export async function getCloudSyncQueue() {
  await openDatabase();
  const [results] = await db.executeSql('SELECT * FROM cloud_sync_queue ORDER BY timestamp ASC;');
  let queue = [];
  for (let i = 0; i < results.rows.length; i++) {
    const item = results.rows.item(i);
    item.data = JSON.parse(item.data);
    queue.push(item);
  }
  return queue;
}

export async function removeFromCloudSyncQueue(id) {
  await openDatabase();
  return db.executeSql('DELETE FROM cloud_sync_queue WHERE id=?;', [id]);
}

export async function updateCloudSyncQueueRetry(id, retryCount) {
  await openDatabase();
  return db.executeSql('UPDATE cloud_sync_queue SET retry_count=? WHERE id=?;', [retryCount, id]);
}

// --- Sync Log CRUD ---
export async function addSyncLog(log) {
  const { device_id, patient_id, action, timestamp, status, error_message } = log;
  const id = log.id || Math.random().toString(36).substr(2, 9); // Generate ID if not provided
  await openDatabase();
  return db.executeSql(
    `INSERT OR REPLACE INTO sync_logs (id, device_id, patient_id, action, timestamp, status, error_message) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [id, device_id, patient_id, action, timestamp, status, error_message]
  );
}

export async function getSyncLogs() {
  await openDatabase();
  const [results] = await db.executeSql('SELECT * FROM sync_logs ORDER BY timestamp DESC;');
  let logs = [];
  for (let i = 0; i < results.rows.length; i++) {
    logs.push(results.rows.item(i));
  }
  return logs;
}

export async function clearSyncLogs() {
  await openDatabase();
  return db.executeSql('DELETE FROM sync_logs;');
}

// --- Statistics and Analytics ---
export async function getPatientStats() {
  await openDatabase();
  const [results] = await db.executeSql(`
    SELECT 
      COUNT(*) as total_patients,
      COUNT(CASE WHEN gender = 'male' THEN 1 END) as male_count,
      COUNT(CASE WHEN gender = 'female' THEN 1 END) as female_count,
      AVG(age) as avg_age,
      COUNT(CASE WHEN cloud_sync_status = 'synced' THEN 1 END) as synced_count,
      COUNT(CASE WHEN cloud_sync_status = 'pending' THEN 1 END) as pending_count
    FROM patients;
  `);
  return results.rows.item(0);
}

export async function getPatientsByArea() {
  await openDatabase();
  const [results] = await db.executeSql(`
    SELECT area_code, COUNT(*) as count 
    FROM patients 
    GROUP BY area_code 
    ORDER BY count DESC;
  `);
  let areas = [];
  for (let i = 0; i < results.rows.length; i++) {
    areas.push(results.rows.item(i));
  }
  return areas;
}
