# 🚀 Supabase Integration Setup Guide

This guide will help you set up Supabase PostgreSQL integration for the Health Records Management System, enabling automatic cloud sync and NGO dashboard capabilities.

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **React Native Project**: Ensure your project is running
3. **Internet Connectivity**: For initial setup and testing

## 🗄️ Database Schema Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `health-records-dashboard`
   - **Database Password**: Choose a strong password 
   - **Region**: Select closest to your target users

### 2. Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Patients table (enhanced for professional healthcare)
CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unique_id TEXT UNIQUE NOT NULL,
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
  updated_at BIGINT NOT NULL,
  created_at BIGINT NOT NULL,
  sync_status TEXT DEFAULT 'local',
  cloud_sync_status TEXT DEFAULT 'pending',
  
  -- Timestamps
  created_at_cloud TIMESTAMP DEFAULT NOW(),
  updated_at_cloud TIMESTAMP DEFAULT NOW()
);

-- Sync logs for tracking
CREATE TABLE sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'synced', 'sync_failed'
  timestamp BIGINT NOT NULL,
  status TEXT NOT NULL, -- 'success', 'failed'
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Areas table for NGO dashboard
CREATE TABLE areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  area_code TEXT UNIQUE NOT NULL,
  area_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default areas
INSERT INTO areas (area_code, area_name, description) VALUES
  ('GAZA_NORTH', 'Gaza North', 'Northern Gaza Strip'),
  ('GAZA_CITY', 'Gaza City', 'Gaza City metropolitan area'),
  ('GAZA_CENTRAL', 'Gaza Central', 'Central Gaza Strip'),
  ('KHAN_YUNIS', 'Khan Yunis', 'Khan Yunis Governorate'),
  ('RAFAH', 'Rafah', 'Rafah Governorate'),
  ('DEIR_AL_BALAH', 'Deir al-Balah', 'Deir al-Balah Governorate'),
  ('BEIT_LAHIA', 'Beit Lahia', 'Beit Lahia area'),
  ('BEIT_HANOUN', 'Beit Hanoun', 'Beit Hanoun area'),
  ('JABALIA', 'Jabalia', 'Jabalia refugee camp and surrounding areas'),
  ('OTHER', 'Other', 'Other areas not specified');

-- Create indexes for performance
CREATE INDEX idx_patients_unique_id ON patients(unique_id);
CREATE INDEX idx_patients_area_code ON patients(area_code);
CREATE INDEX idx_patients_cloud_sync_status ON patients(cloud_sync_status);
CREATE INDEX idx_sync_logs_device_id ON sync_logs(device_id);
CREATE INDEX idx_sync_logs_timestamp ON sync_logs(timestamp);

-- Create views for dashboard
CREATE VIEW patient_summary AS
SELECT 
  area_code,
  COUNT(*) as total_patients,
  COUNT(CASE WHEN gender = 'male' THEN 1 END) as male_count,
  COUNT(CASE WHEN gender = 'female' THEN 1 END) as female_count,
  AVG(age) as avg_age,
  MAX(updated_at) as last_update,
  COUNT(CASE WHEN cloud_sync_status = 'synced' THEN 1 END) as synced_count
FROM patients 
GROUP BY area_code;

CREATE VIEW medical_conditions_summary AS
SELECT 
  area_code,
  medical_condition,
  COUNT(*) as condition_count
FROM patients 
WHERE medical_condition IS NOT NULL AND medical_condition != ''
GROUP BY area_code, medical_condition
ORDER BY condition_count DESC;

-- Row Level Security (RLS) - Optional but recommended
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your security needs)
CREATE POLICY "Allow all operations for authenticated users" ON patients
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON sync_logs
  FOR ALL USING (true);

CREATE POLICY "Allow read access to areas" ON areas
  FOR SELECT USING (true);
```

## 🔑 API Configuration

### 1. Get API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. Configure App

1. Open the app
2. Go to **Settings** tab
3. Enter your Supabase configuration:
   - **Supabase URL**: Your project URL
   - **Supabase Anon Key**: Your anon key
4. Click **Test Connection** to verify
5. Click **Save Settings**

## 📱 App Configuration

### 1. Install Dependencies

```bash
# Install new dependencies
yarn add @supabase/supabase-js @react-native-community/netinfo

# For iOS (if you add iOS support later)
cd ios && pod install && cd ..
```

### 2. Android Permissions

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### 3. Configure Area Code

1. In the app, go to **Settings**
2. Select your **Area Code** from the dropdown
3. This will be used to categorize patients for NGO dashboards

## 🔄 Sync Functionality

### Automatic Sync

- **When Online**: Data automatically syncs to Supabase
- **When Offline**: Data is queued and syncs when connection is restored
- **Conflict Resolution**: Uses timestamp-based resolution

### Manual Sync

- Use the **"Sync to Cloud"** button in the Home screen
- Check sync status in the Settings screen
- View sync logs for troubleshooting

## 📊 Dashboard Access

### 1. Supabase Dashboard

Access your data through the Supabase dashboard:
- **Table Editor**: View and edit patient records
- **SQL Editor**: Run custom queries
- **Logs**: Monitor sync activity

### 2. Custom Dashboard (Optional)

You can build custom dashboards using:
- **Supabase Dashboard**: Built-in analytics
- **PowerBI/Tableau**: Connect via PostgreSQL
- **Custom Web App**: Using Supabase client libraries

### 3. Sample Queries

```sql
-- Get patient count by area
SELECT area_code, COUNT(*) as patient_count 
FROM patients 
GROUP BY area_code 
ORDER BY patient_count DESC;

-- Get recent activity
SELECT name, area_code, created_at_cloud 
FROM patients 
ORDER BY created_at_cloud DESC 
LIMIT 10;

-- Get medical condition statistics
SELECT medical_condition, COUNT(*) as count 
FROM patients 
WHERE medical_condition IS NOT NULL 
GROUP BY medical_condition 
ORDER BY count DESC;
```

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check Supabase URL and key
   - Verify internet connectivity
   - Check Supabase project status

2. **Sync Not Working**
   - Ensure area code is set
   - Check sync status in Settings
   - Verify patient data has required fields

3. **Data Not Appearing**
   - Check RLS policies
   - Verify table permissions
   - Check sync logs for errors

### Debug Mode

Enable debug logging by setting:
```javascript
// In src/services/supabase.js
console.log('Supabase operations:', data);
```

## 🔒 Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **RLS Policies**: Implement proper row-level security
3. **Data Encryption**: Consider encrypting sensitive data
4. **Access Control**: Limit dashboard access to authorized personnel

## 📈 Performance Optimization

1. **Indexes**: Database indexes are already created
2. **Batch Operations**: Sync processes data in batches
3. **Offline Queue**: Failed operations are queued for retry
4. **Connection Pooling**: Supabase handles connection management

## 🚀 Next Steps

1. **Test the Integration**: Add test patients and verify sync
2. **Monitor Performance**: Check sync logs and dashboard
3. **Customize Dashboard**: Build custom views for your needs
4. **Scale Up**: Add more devices and areas as needed

## 📞 Support

For issues with:
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **App Integration**: Check sync logs and connection status
- **Data Issues**: Verify database schema and permissions

---

**Note**: This setup enables professional healthcare record management with automatic cloud synchronization, making it suitable for NGO health workers in low-connectivity environments. 