import React, { useEffect, useState } from 'react';
import { View, FlatList, Modal, TouchableOpacity, Alert, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { Button, Icon, Text, Badge } from 'react-native-elements';
import PatientCard from '../components/PatientCard';
import PatientForm from '../components/PatientForm';
import SyncProgress from '../components/SyncProgress';
import { getPatients, addPatient, updatePatient, deletePatient, getPatientStats } from '../services/database';
import { startConnectivityMonitoring, getConnectivityStatus, addConnectivityListener, manualSync, getSyncStats } from '../services/connectivity';
import { COLORS, AREA_CODES } from '../constants';

const HomeScreen = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [syncStats, setSyncStats] = useState({});
  const [syncing, setSyncing] = useState(false);

  const loadPatients = async () => {
    setLoading(true);
    const data = await getPatients();
    setPatients(data);
    setLoading(false);
  };

  const loadSyncStats = async () => {
    const stats = await getSyncStats();
    setSyncStats(stats);
  };

  useEffect(() => {
    loadPatients();
    loadSyncStats();
    
    // Start connectivity monitoring
    startConnectivityMonitoring();
    setIsConnected(getConnectivityStatus());
    
    // Set up connectivity listener
    const unsubscribe = addConnectivityListener((connected) => {
      setIsConnected(connected);
    });
    
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!search) setFiltered(patients);
    else setFiltered(patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase())));
  }, [search, patients]);

  const handleAdd = () => {
    setEditingPatient(null);
    setModalVisible(true);
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setModalVisible(true);
  };

  const handleDelete = (patient) => {
    Alert.alert(
      'Delete Patient',
      `Are you sure you want to delete ${patient.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            await deletePatient(patient.unique_id);
            loadPatients();
            loadSyncStats();
          }
        }
      ]
    );
  };

  const handleSubmit = async (form) => {
    try {
      console.log('Submitting form:', form);
      
    if (editingPatient) {
        console.log('Updating existing patient...');
      await updatePatient({ 
        ...editingPatient, 
        ...form, 
        updated_at: Date.now(),
        cloud_sync_status: 'pending'
      });
    } else {
        console.log('Adding new patient...');
        const patientData = {
        ...form,
        unique_id: Math.random().toString(36).substr(2, 9),
        created_at: Date.now(),
        updated_at: Date.now(),
        sync_status: 'local',
        cloud_sync_status: 'pending',
        };
        console.log('Patient data to add:', patientData);
        await addPatient(patientData);
    }
      
      console.log('Patient saved successfully');
    setModalVisible(false);
    loadPatients();
    loadSyncStats();
    } catch (error) {
      console.error('Error saving patient:', error);
      Alert.alert('Error', 'Failed to save patient: ' + error.message);
    }
  };

  const handleManualSync = async () => {
    if (!isConnected) {
      Alert.alert('No Internet', 'Please check your internet connection and try again.');
      return;
    }
    
    setSyncing(true);
    try {
      await manualSync();
      Alert.alert('Sync Complete', 'Patient data has been synced to the cloud successfully!');
      loadSyncStats();
    } catch (error) {
      Alert.alert('Sync Failed', error.message || 'Failed to sync data to cloud');
    } finally {
      setSyncing(false);
    }
  };

  const renderPatientCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.cardContentRow} onPress={() => handleEdit(item)}>
        <View style={{ flex: 1 }}>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text style={styles.patientDetails}>
            {item.age} yrs • {item.gender} • {AREA_CODES[item.area_code] || item.area_code}
          </Text>
          <Text style={styles.medicalCondition} numberOfLines={1}>
            {item.medical_condition || 'No medical condition specified'}
          </Text>
          {item.phone_number ? (
            <Text style={styles.phoneNumber}>📞 {item.phone_number}</Text>
          ) : null}
          <View style={styles.tagsRow}>
            {item.blood_group ? (
              <View style={styles.tag}><Text style={styles.tagText}>🩸 {item.blood_group}</Text></View>
            ) : null}
            {item.allergies ? (
              <View style={styles.tag}><Text style={styles.tagText}>⚠️ Allergies</Text></View>
            ) : null}
          </View>
        </View>
        <View style={styles.syncStatusRight}>
        <Icon 
          name={item.cloud_sync_status === 'synced' ? 'cloud-done' : 'cloud-upload'} 
          color={item.cloud_sync_status === 'synced' ? COLORS.success : COLORS.warning} 
            size={22}
        />
      </View>
      </TouchableOpacity>
    </View>
  );

  return (
      <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Minimal Header */}
        <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Patients</Text>
          <View style={styles.headerRight}>
            <View style={styles.connectionIndicator}>
              <Icon 
                name={isConnected ? 'wifi' : 'wifi-off'} 
                color={COLORS.white} 
                size={16} 
              />
              <Text style={styles.connectionText}>
                {isConnected ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Compact Stats Dashboard */}
      <View style={styles.statsContainerMinimal}>
        <Text style={styles.statLabelMinimal}>Total: <Text style={styles.statNumberMinimal}>{patients.length}</Text></Text>
        <Text style={styles.statLabelMinimal}>Synced: <Text style={styles.statNumberMinimal}>{syncStats.syncedPatients || 0}</Text></Text>
        <Text style={styles.statLabelMinimal}>Pending: <Text style={styles.statNumberMinimal}>{syncStats.pendingPatients || 0}</Text></Text>
        </View>

        {/* Sync Button */}
        {isConnected && (
          <TouchableOpacity 
            style={[styles.syncButton, syncing && styles.syncButtonDisabled]} 
            onPress={handleManualSync}
            disabled={syncing}
          >
            <Icon name="cloud-upload" color={COLORS.white} size={20} />
            <Text style={styles.syncButtonText}>
              {syncing ? 'Syncing...' : 'Sync to Cloud'}
            </Text>
          </TouchableOpacity>
        )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" color={COLORS.muted} size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients by name..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={COLORS.muted}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton}>
              <Icon name="close" color={COLORS.muted} size={20} />
            </TouchableOpacity>
          ) : null}
        </View>
        </View>

      {/* Patients List */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.unique_id}
          renderItem={renderPatientCard}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" color={COLORS.muted} size={64} />
            <Text style={styles.emptyTitle}>No Patients Found</Text>
            <Text style={styles.emptySubtitle}>
              {search ? 'Try adjusting your search terms' : 'Add your first patient to get started'}
            </Text>
          </View>
        }
          refreshing={loading}
          onRefresh={() => {
            loadPatients();
            loadSyncStats();
          }}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        />

      {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={handleAdd}>
        <Icon name="add" color={COLORS.white} size={28} />
        </TouchableOpacity>

      {/* Patient Form Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        presentationStyle="pageSheet"
        >
              <PatientForm
                initialValues={editingPatient || undefined}
                onSubmit={handleSubmit}
          submitLabel={editingPatient ? 'Update Patient' : 'Add Patient'}
              />
        <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                type="clear"
                onPress={() => setModalVisible(false)}
            titleStyle={styles.cancelButtonText}
              />
          </View>
        </Modal>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 24,
    paddingBottom: 8,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  connectionText: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    elevation: 2,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
    textAlign: 'center',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
  },
  syncButtonDisabled: {
    opacity: 0.6,
  },
  syncButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  searchContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingBottom: 80,
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  patientDetails: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 2,
  },
  syncStatus: {
    padding: 4,
  },
  cardBody: {
    marginBottom: 12,
  },
  medicalCondition: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 2,
  },
  cardFooter: {
    marginTop: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.muted,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.muted,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalFooter: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  cancelButtonText: {
    color: COLORS.muted,
    fontSize: 16,
  },
  statsContainerMinimal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    marginHorizontal: 8,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 8,
    padding: 8,
    elevation: 0,
  },
  statLabelMinimal: {
    fontSize: 13,
    color: COLORS.muted,
  },
  statNumberMinimal: {
    fontWeight: 'bold',
    color: COLORS.primary,
    fontSize: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  syncStatusRight: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
