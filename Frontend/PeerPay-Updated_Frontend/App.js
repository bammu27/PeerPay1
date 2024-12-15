import React from 'react';
import { StyleSheet, View } from 'react-native'//npx expo start
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './App/Screens/AppNavigator'; // Import your AppNavigator

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <AppNavigator />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
