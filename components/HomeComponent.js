import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, Text, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeComponent() {



    return (
        <ScrollView contentContainerStyle={styles.scrollContainer2}>
            <View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer2: {
        flexGrow: 1,
        height: 500,
        backgroundColor: '#0000',
    },
    scrollViewHome: {
        backgroundColor: '#0000',
    },
});
