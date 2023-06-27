import React from 'react'
import { View, StyleSheet, ImageBackground, ScrollView, Text, TouchableOpacity, Animated } from 'react-native';
export default function HomeComponent() {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer2}>
            <Text>Home component</Text>
        </ScrollView>
    )
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