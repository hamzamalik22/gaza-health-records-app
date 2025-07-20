import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';

const AppNavigator = () => (
  <NavigationContainer>
    <HomeScreen />
  </NavigationContainer>
);

export default AppNavigator;
