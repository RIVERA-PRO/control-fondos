import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import BottomTabsNavigation from './navigation/BottomTabsNavigation';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const [refreshing, setRefreshing] = useState(false); // Estado para controlar el estado de actualización

  const handleRefresh = () => {
    // Aquí puedes realizar las operaciones de actualización de datos
    setRefreshing(true);

    // Después de que las operaciones de actualización hayan terminado, establece refreshing en false para indicar que la actualización ha finalizado.
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={ // Agrega el RefreshControl al ScrollView
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
        >
          <View style={styles.contentContainer}>
            <BottomTabsNavigation />
          </View>
        </ScrollView>
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
