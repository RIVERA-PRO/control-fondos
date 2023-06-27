import React from 'react'
import { View, StyleSheet, ImageBackground, ScrollView, Text, TouchableOpacity, Animated } from 'react-native';
export default function Categorias() {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>

        </ScrollView>
    )
}
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,

    },
    scrollViewHome: {
        height: '100%',
        flex: 1,
        gap: 30,
        paddingTop: 50,
    },

});