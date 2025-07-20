/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import HomeScreen from './src/screens/HomeScreen';
import SyncScreen from './src/screens/SyncScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { COLORS } from './src/constants';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Home');

  let ScreenComponent;
  if (currentScreen === 'Home') ScreenComponent = HomeScreen;
  else if (currentScreen === 'Sync') ScreenComponent = SyncScreen;
  else if (currentScreen === 'Settings') ScreenComponent = SettingsScreen;

  const navItems = [
    { key: 'Home', icon: 'home', label: 'Patients' },
    { key: 'Sync', icon: 'cloud-sync', label: 'Sync' },
    { key: 'Settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScreenComponent />
      
      {/* Modern Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.navItem,
              currentScreen === item.key && styles.navItemActive
            ]}
            onPress={() => setCurrentScreen(item.key)}
          >
            <View style={[
              styles.navIconContainer,
              currentScreen === item.key && styles.navIconContainerActive
            ]}>
              <Icon
                name={item.icon}
                color={currentScreen === item.key ? COLORS.white : COLORS.muted}
                size={24}
              />
            </View>
            <Text style={[
              styles.navLabel,
              currentScreen === item.key && styles.navLabelActive
            ]}>
              {item.label}
            </Text>
        </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bottomNavigation: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingBottom: 16,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  navItemActive: {
    transform: [{ scale: 1.05 }],
  },
  navIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    // Ensure background is transparent for inactive tabs
    backgroundColor: 'transparent',
  },
  navIconContainerActive: {
    backgroundColor: COLORS.primary,
    elevation: 4,
    // Ensure borderRadius is fully round for all active tabs
    borderRadius: 24,
  },
  navLabel: {
    color: COLORS.muted,
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default App;
