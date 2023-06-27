import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, Text, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
export default function Actividad() {
    const isFocused = useIsFocused();
    const [actividades, setActividades] = useState([]);
    const navigation = useNavigation();


    useEffect(() => {
        obtenerActividades();
    }, [isFocused]);
    const goToActividades = () => {
        navigation.navigate('Actividades');

    };
    const obtenerActividades = async () => {
        try {
            const actividadesGuardadas = await AsyncStorage.getItem('actividades');
            if (actividadesGuardadas) {
                const actividadesParseadas = JSON.parse(actividadesGuardadas);
                setActividades(actividadesParseadas);
            }
        } catch (error) {
            console.log('Error al obtener las actividades:', error);
        }
    };

    if (actividades.length === 0) {
        return (
            <View style={styles.scrollContainer2}>
                <Text>No hay actividades</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer2}>
            <View style={styles.deFlex}>
                <Text>Actividad</Text>

                <TouchableOpacity onPress={goToActividades}>
                    <Text>Ver más</Text>
                </TouchableOpacity>
            </View>
            {actividades.map((actividad) => (
                <View key={actividad.id} style={styles.actividadContainer}>
                    <MaterialCommunityIcons name="bank-transfer" size={24} color="black" />

                    <View style={styles.deRow}>
                        <Text style={styles.Date}>{new Date(actividad.createdAt).toLocaleString()}</Text>
                        <Text style={styles.descripcion}>{actividad.descripcion}</Text>
                    </View>

                    <Text style={{ color: actividad.categoria === 'Ingreso' ? 'green' : 'red' }}>$ {actividad.monto}</Text>

                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer2: {
        flexGrow: 1,
        paddingTop: 10,

    },
    actividadContainer: {

        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center'
    },
    deFlex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    deRow: {
        flexDirection: 'column',

    },
});
