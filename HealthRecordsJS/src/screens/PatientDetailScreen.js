import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, Icon, Card } from 'react-native-elements';
import { COLORS } from '../constants';

// Stub patient data
const mockPatient = {
  unique_id: 'abc123',
  name: 'Hamza Ali',
  age: 21,
  gender: 'male',
  medical_condition: 'Flu',
  created_at: Date.now() - 86400000,
  updated_at: Date.now(),
};

const PatientDetailScreen = () => {
  const [patient, setPatient] = useState(mockPatient);

  const handleEdit = () => {
    Alert.alert('Edit', 'Edit patient (stubbed)');
  };

  const handleDelete = () => {
    Alert.alert('Delete', `Delete ${patient.name} (stubbed)`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text h4 style={styles.headerTitle}>Patient Details</Text>
      </View>
      <Card containerStyle={[styles.card, { backgroundColor: COLORS.white }]}>
        <Card.Title style={[styles.cardTitle, { color: COLORS.primary }]}>{patient.name}</Card.Title>
        <Card.Divider />
        <View style={styles.infoRow}><Text style={[styles.label, { color: COLORS.primary }]}>Age:</Text><Text style={[styles.value, { color: COLORS.text }]}>{patient.age}</Text></View>
        <View style={styles.infoRow}><Text style={[styles.label, { color: COLORS.primary }]}>Gender:</Text><Text style={[styles.value, { color: COLORS.text }]}>{patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}</Text></View>
        <View style={styles.infoRow}><Text style={[styles.label, { color: COLORS.primary }]}>Condition:</Text><Text style={[styles.value, { color: COLORS.text }]}>{patient.medical_condition}</Text></View>
        <View style={styles.infoRow}><Text style={[styles.label, { color: COLORS.primary }]}>Created:</Text><Text style={[styles.value, { color: COLORS.text }]}>{new Date(patient.created_at).toLocaleString()}</Text></View>
        <View style={styles.infoRow}><Text style={[styles.label, { color: COLORS.primary }]}>Updated:</Text><Text style={[styles.value, { color: COLORS.text }]}>{new Date(patient.updated_at).toLocaleString()}</Text></View>
      </Card>
      <View style={styles.fabRow}>
        <TouchableOpacity style={[styles.fabEdit, { backgroundColor: COLORS.primary }]} onPress={handleEdit}>
          <Icon name="edit" color={COLORS.white} size={28} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fabDelete, { backgroundColor: COLORS.danger }]} onPress={handleDelete}>
          <Icon name="delete" color={COLORS.white} size={28} />
        </TouchableOpacity>
      </View>
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
  card: {
    borderRadius: 20,
    elevation: 2,
    marginTop: 32,
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  value: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '500',
  },
  fabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  fabEdit: {
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    elevation: 4,
  },
  fabDelete: {
    backgroundColor: COLORS.danger,
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    elevation: 4,
  },
});

export default PatientDetailScreen;
