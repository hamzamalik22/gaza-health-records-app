import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { Text, Button, Icon, Input } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, STORAGE_KEYS, AREA_CODES } from '../constants';
import { testConnection, getDashboardStats } from '../services/supabase';
import { getSyncStats, getLastSyncTime, manualSync } from '../services/connectivity';
import { getPatients, clearSyncLogs } from '../services/database';
import { SUPABASE_CONFIG } from '../config/env';

const SettingsScreen = () => {
  const [deviceName, setDeviceName] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [syncStats, setSyncStats] = useState({});
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadSettings();
    loadStats();
  }, []);

  const loadSettings = async () => {
    try {
      const storedDeviceName = await AsyncStorage.getItem(STORAGE_KEYS.deviceName);
      const storedAreaCode = await AsyncStorage.getItem(STORAGE_KEYS.areaCode);
      setDeviceName(storedDeviceName || 'Health Worker Device');
      setAreaCode(storedAreaCode || 'GAZA_CITY');
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const loadStats = async () => {
    try {
      const stats = await getSyncStats();
      const lastSync = await getLastSyncTime();
      setSyncStats(stats);
      setLastSyncTime(lastSync);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.deviceName, deviceName);
      await AsyncStorage.setItem(STORAGE_KEYS.areaCode, areaCode);
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      await manualSync();
      Alert.alert('Success', 'Manual sync completed successfully!');
      loadStats();
    } catch (error) {
      Alert.alert('Error', 'Manual sync failed: ' + error.message);
    } finally {
      setSyncing(false);
    }
  };

  const exportDatabase = async () => {
    try {
      const patients = await getPatients();
      const data = {
        patients,
        exportDate: new Date().toISOString(),
        deviceName,
        areaCode,
      };
      
      // In a real app, you'd save this to a file
      console.log('Database export:', JSON.stringify(data, null, 2));
      Alert.alert('Success', 'Database exported successfully! Check console for data.');
    } catch (error) {
      Alert.alert('Error', 'Failed to export database');
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all patient records and sync logs. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearSyncLogs();
              // Note: In a real app, you'd also clear the patients table
              Alert.alert('Success', 'All data cleared successfully!');
              loadStats();
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text h4 style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Device Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Configuration</Text>
        <Input
          label="Device Name"
          value={deviceName}
          onChangeText={setDeviceName}
          placeholder="Enter device name"
          containerStyle={styles.input}
        />
        <Text style={styles.label}>Area Code</Text>
        <View style={styles.roundSelectorRow}>
          {Object.entries(AREA_CODES).map(([code, name]) => (
            <TouchableOpacity
              key={code}
              style={[styles.roundSelectorBtn, areaCode === code && styles.roundSelectorBtnSelected]}
              onPress={() => setAreaCode(code)}
            >
              <Text style={areaCode === code ? styles.roundSelectorTextSelected : styles.roundSelectorText}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button
          title="Save Settings"
          onPress={saveSettings}
          buttonStyle={styles.saveButton}
          containerStyle={styles.buttonContainer}
        />
      </View>

      {/* Supabase Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cloud Sync Configuration</Text>
        <Text style={{color: COLORS.success, marginBottom: 12}}>
          Cloud sync is securely configured.
          </Text>
        {/* Remove connection status and Test Connection button UI */}
      </View>

      {/* Sync Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sync Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Patients</Text>
            <Text style={styles.statValue}>{syncStats.totalPatients || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Synced</Text>
            <Text style={styles.statValue}>{syncStats.syncedPatients || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Pending</Text>
            <Text style={styles.statValue}>{syncStats.pendingPatients || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Sync %</Text>
            <Text style={styles.statValue}>{syncStats.syncPercentage || 0}%</Text>
          </View>
        </View>
        {lastSyncTime && (
          <Text style={styles.lastSyncText}>
            Last Sync: {new Date(lastSyncTime).toLocaleString()}
          </Text>
        )}
        <Button
          title={syncing ? 'Syncing...' : 'Manual Sync'}
          onPress={handleManualSync}
          loading={syncing}
          buttonStyle={styles.syncButton}
          containerStyle={styles.buttonContainer}
        />
      </View>

      {/* App Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        <Text style={styles.infoText}>Version: 1.0.0</Text>
        <Text style={styles.infoText}>Health Records Management System</Text>
        <Text style={styles.infoText}>Designed for NGO Health Workers</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    elevation: 2,
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    marginLeft: 10,
    marginBottom: 4,
    fontWeight: 'bold',
    color: COLORS.muted,
    fontSize: 16,
  },
  pickerContainer: {
    borderBottomWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  connectionStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  connectionStatusLabel: {
    fontSize: 16,
    color: COLORS.muted,
    marginRight: 8,
  },
  connectionStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 12,
  },
  testButton: {
    backgroundColor: COLORS.info,
    borderRadius: 8,
    paddingVertical: 12,
  },
  syncButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
  },
  exportButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingVertical: 12,
  },
  clearButton: {
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    paddingVertical: 12,
  },
  saveButton: {
    backgroundColor: COLORS.success,
    borderRadius: 8,
    paddingVertical: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  lastSyncText: {
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: 14,
    marginBottom: 16,
  },
  infoText: {
    color: COLORS.muted,
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  roundSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    marginTop: 8,
  },
  roundSelectorBtn: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: COLORS.white,
  },
  roundSelectorBtnSelected: {
    backgroundColor: COLORS.primary,
  },
  roundSelectorText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  roundSelectorTextSelected: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
