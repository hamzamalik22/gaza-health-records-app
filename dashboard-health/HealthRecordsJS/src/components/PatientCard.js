import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import { COLORS } from '../constants';

const PatientCard = ({ patient, onPress, onEdit, onDelete }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.patientDetails}>
            {patient.age} years • {patient.gender} • {patient.area_code}
          </Text>
        </View>
        <View style={styles.syncStatus}>
          <Icon 
            name={patient.cloud_sync_status === 'synced' ? 'cloud-done' : 'cloud-upload'} 
            color={patient.cloud_sync_status === 'synced' ? COLORS.success : COLORS.warning} 
            size={20} 
          />
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <Text style={styles.medicalCondition} numberOfLines={1}>
          {patient.medical_condition || 'No medical condition specified'}
        </Text>
        {patient.phone_number && (
          <Text style={styles.phoneNumber}>
            📞 {patient.phone_number}
          </Text>
        )}
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.tags}>
          {patient.blood_group && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>🩸 {patient.blood_group}</Text>
            </View>
          )}
          {patient.allergies && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>⚠️ Allergies</Text>
            </View>
          )}
        </View>
      </View>
      
      {(onEdit || onDelete) && (
        <View style={styles.cardActions}>
          {onEdit && (
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Icon name="edit" color={COLORS.primary} size={18} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
              <Icon name="delete" color={COLORS.danger} size={18} />
            </TouchableOpacity>
          )}
        </View>
      )}
  </TouchableOpacity>
);
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: COLORS.muted,
  },
  syncStatus: {
    padding: 4,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  medicalCondition: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 14,
    color: COLORS.muted,
  },
  cardFooter: {
    paddingHorizontal: 16,
    paddingBottom: 12,
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
});

export default PatientCard;
