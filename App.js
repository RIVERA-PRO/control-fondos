import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import BottomTabsNavigation from './navigation/BottomTabsNavigation';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {


  return (
    <View style={styles.container}>
      <NavigationContainer>

        <View style={styles.contentContainer}>
          <BottomTabsNavigation />
        </View>

      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
  },
});
