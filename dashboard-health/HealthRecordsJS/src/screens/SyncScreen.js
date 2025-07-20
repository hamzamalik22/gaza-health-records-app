import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, Icon } from 'react-native-elements';
import DeviceList from '../components/DeviceList';
import { startScan, stopScan, connectToDevice, receiveJsonOverBle } from '../services/bluetooth';
import { syncDataChunked, importAndMergePatientsFromJson } from '../services/sync';
import { getPatients } from '../services/database';
import { COLORS } from '../constants';

const mockLogs = [
  { id: 'log-1', action: 'sent', device: 'Nurse Tablet', status: 'success', timestamp: Date.now() - 60000 },
  { id: 'log-2', action: 'received', device: 'Doctor Phone', status: 'success', timestamp: Date.now() - 120000 },
];

const SyncScreen = () => {
  const [devices, setDevices] = useState([]);
  const [logs, setLogs] = useState(mockLogs);
  const [scanning, setScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [receiving, setReceiving] = useState(false);
  const foundDeviceIds = useRef(new Set());
  // At the top of the component, add sync mode state
  const [syncMode, setSyncMode] = useState('auto'); // or 'manual'

  const handleScan = () => {
    setDevices([]);
    foundDeviceIds.current.clear();
    setScanning(true);
    startScan(
      (device) => {
        if (device && device.id && !foundDeviceIds.current.has(device.id)) {
          foundDeviceIds.current.add(device.id);
          setDevices(prev => [...prev, { id: device.id, name: device.name || 'Unknown Device' }]);
        }
      },
      (error) => {
        setScanning(false);
        if (error) {
          Alert.alert('Scan Error', error.message || String(error));
        }
      }
    );
  };

  const handleSelectDevice = async (device) => {
    try {
      setScanning(false);
      stopScan();
      const connected = await connectToDevice(device.id);
      setConnectedDevice(connected);
      Alert.alert('Connected', `Connected to ${device.name}`);
    } catch (e) {
      Alert.alert('Connection Error', e.message || String(e));
    }
  };

  const handleSyncNow = async () => {
    if (!connectedDevice) return;
    setSyncing(true);
    setSyncProgress(0);
    try {
      const patients = await getPatients();
      await syncDataChunked(connectedDevice, patients, (percent) => setSyncProgress(percent));
      setSyncing(false);
      setSyncProgress(100);
      Alert.alert('Sync Complete', 'Patient data synced successfully!');
      setLogs(prev => [
        { id: Math.random().toString(36).substr(2, 9), action: 'sent', device: connectedDevice.name || connectedDevice.id, status: 'success', timestamp: Date.now() },
        ...prev
      ]);
    } catch (e) {
      setSyncing(false);
      Alert.alert('Sync Failed', e.message || String(e));
      setLogs(prev => [
        { id: Math.random().toString(36).substr(2, 9), action: 'sent', device: connectedDevice.name || connectedDevice.id, status: 'failed', timestamp: Date.now() },
        ...prev
      ]);
    }
  };

  const handleReceiveSync = async () => {
    if (!connectedDevice) return;
    setReceiving(true);
    Alert.alert('Waiting for data...', 'Keep this screen open to receive sync data.');
    await receiveJsonOverBle(
      connectedDevice,
      null,
      async (err, json) => {
        setReceiving(false);
        if (err) {
          Alert.alert('Receive Failed', err.message || String(err));
          return;
        }
        const added = await importAndMergePatientsFromJson(json);
        Alert.alert('Sync Received', `${added} new patient records imported.`);
        setLogs(prev => [
          { id: Math.random().toString(36).substr(2, 9), action: 'received', device: connectedDevice.name || connectedDevice.id, status: 'success', timestamp: Date.now() },
          ...prev
        ]);
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text h4 style={styles.headerTitle}>Bluetooth Sync</Text>
      </View>
      {/* Add round selector UI at the top, below the header */}
      <View style={styles.roundSelectorRow}>
        {['auto', 'manual'].map(mode => (
          <TouchableOpacity
            key={mode}
            style={[styles.roundSelectorBtn, syncMode === mode && styles.roundSelectorBtnSelected]}
            onPress={() => setSyncMode(mode)}
          >
            <Text style={syncMode === mode ? styles.roundSelectorTextSelected : styles.roundSelectorText}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button
        title={scanning ? 'Scanning...' : 'Scan for Devices'}
        icon={<Icon name="bluetooth-searching" type="material" color={COLORS.white} />}
        onPress={handleScan}
        loading={scanning}
        buttonStyle={styles.scanButton}
        containerStyle={{ marginBottom: 16 }}
        disabled={scanning}
      />
      {connectedDevice && (
        <View style={styles.connectedBar}>
          <Icon name="bluetooth-connected" type="material" color={COLORS.success} size={22} />
          <Text style={styles.connectedText}>Connected: {connectedDevice.name || connectedDevice.id}</Text>
        </View>
      )}
      <Button
        title={syncing ? `Syncing... ${syncProgress}%` : 'Sync Now'}
        icon={<Icon name="sync" type="material" color={COLORS.white} />}
        onPress={handleSyncNow}
        loading={syncing}
        buttonStyle={styles.syncButton}
        containerStyle={{ marginBottom: 8, marginHorizontal: 16 }}
        disabled={!connectedDevice || syncing || receiving}
      />
      <Button
        title={receiving ? 'Receiving...' : 'Receive Sync'}
        icon={<Icon name="download" type="material" color={COLORS.white} />}
        onPress={handleReceiveSync}
        loading={receiving}
        buttonStyle={[styles.syncButton, { backgroundColor: COLORS.info }]}
        containerStyle={{ marginBottom: 16, marginHorizontal: 16 }}
        disabled={!connectedDevice || receiving || syncing}
      />
      <Text style={styles.sectionTitle}>Available Devices</Text>
      <DeviceList devices={devices} onSelect={handleSelectDevice} />
      <Text style={styles.sectionTitle}>Sync Logs</Text>
      <ScrollView style={styles.logList}>
        {logs.length === 0 ? (
          <Text style={styles.emptyText}>No sync logs yet.</Text>
        ) : (
          logs.map(log => (
            <View key={log.id} style={styles.logItem}>
              <Icon
                name={log.action === 'sent' ? 'arrow-upward' : 'arrow-downward'}
                color={log.action === 'sent' ? COLORS.primary : COLORS.success}
                size={18}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.logText}>{log.action} {log.device}</Text>
              <Text style={[styles.logText, { color: log.status === 'success' ? COLORS.success : COLORS.danger, marginLeft: 8 }]}>
                {log.status}
              </Text>
              <Text style={styles.logTime}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 0,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
    elevation: 2,
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  scanButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  syncButton: {
    backgroundColor: COLORS.success,
    borderRadius: 8,
    paddingVertical: 12,
  },
  connectedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9', // Optionally add to COLORS if needed
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 8,
  },
  connectedText: {
    color: COLORS.success,
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 18,
    marginBottom: 6,
    marginLeft: 16,
    color: COLORS.primary,
  },
  logList: {
    marginHorizontal: 16,
    marginTop: 8,
    flex: 1,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    elevation: 1,
  },
  logText: {
    fontSize: 14,
    color: COLORS.text,
  },
  logTime: {
    marginLeft: 'auto',
    fontSize: 12,
    color: COLORS.muted,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.muted,
    marginTop: 16,
    fontSize: 15,
  },
  roundSelectorRow: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 12,
    justifyContent: 'center',
  },
  roundSelectorBtn: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 10,
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

export default SyncScreen;
