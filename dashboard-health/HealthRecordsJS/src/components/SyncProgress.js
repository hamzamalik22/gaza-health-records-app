import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';
import { COLORS } from '../constants';

const statusText = {
  idle: 'Idle',
  syncing: 'Syncing...',
  success: 'Sync Successful',
  error: 'Sync Failed',
};

const statusColor = {
  idle: COLORS.muted,
  syncing: COLORS.info,
  success: COLORS.success,
  error: COLORS.danger,
};

const SyncProgress = ({ status = 'idle', progress }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', margin: 8 }}>
    {status === 'syncing' && <ActivityIndicator color={statusColor[status]} style={{ marginRight: 8 }} />}
    <Text style={{ color: statusColor[status], fontWeight: 'bold' }}>
      {statusText[status]}
      {progress != null && status === 'syncing' ? ` (${progress}%)` : ''}
    </Text>
  </View>
);

export default SyncProgress;
