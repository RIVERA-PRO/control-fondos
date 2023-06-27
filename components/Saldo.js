import React from 'react'
import { View, StyleSheet, ImageBackground, ScrollView, Text, TouchableOpacity, Animated } from 'react-native';
export default function Saldo() {
    return (
        <View contentContainerStyle={styles.scrollContainer2}>
            <View style={styles.saldoContainer}>
                <Text>Saldo</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({


    saldoContainer: {

        height: 100,
        backgroundColor: '#678',
        marginTop: 20,
        margin: 10,
        borderRadius: 20
    }

});