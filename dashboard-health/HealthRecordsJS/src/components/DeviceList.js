import React from 'react';
import { FlatList } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { COLORS } from '../constants';

const DeviceList = ({ devices = [], onSelect }) => (
  <FlatList
    data={devices}
    keyExtractor={item => item.id || item.name}
    renderItem={({ item }) => (
      <ListItem bottomDivider onPress={() => onSelect && onSelect(item)} containerStyle={{ backgroundColor: COLORS.white }}>
        <ListItem.Content>
          <ListItem.Title style={{ color: COLORS.primary }}>{item.name || 'Unknown Device'}</ListItem.Title>
          <ListItem.Subtitle style={{ color: COLORS.muted }}>{item.id}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    )}
    ListEmptyComponent={<Text style={{ textAlign: 'center', margin: 16, color: COLORS.muted }}>No devices found</Text>}
  />
);

export default DeviceList;
