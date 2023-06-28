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
                    <Text style={styles.verMas}>Ver más</Text>
                </TouchableOpacity>
            </View>
            {actividades.slice(0, 6).map((actividad) => (
                <View key={actividad.id} style={styles.actividadContainer}>
                    <MaterialCommunityIcons style={styles.icon} name="bank-transfer" size={24} color="black" />

                    <View style={styles.deRow}>
                        <Text style={styles.Date}>{new Date(actividad.createdAt).toLocaleString()}</Text>
                        {actividad.descripcion.length > 16 ? (
                            <Text style={styles.descripcion}>{actividad.descripcion.slice(0, 16)}..</Text>
                        ) : (
                            <Text style={styles.descripcion}>{actividad.descripcion}</Text>
                        )}
                    </View>

                    <Text style={{ color: actividad?.categoria === 'Ingreso' ? 'green' : 'red', }}>
                        {actividad.categoria === 'Egreso' && '- '}
                        $ {actividad.monto.toLocaleString().slice(0, 14)}
                    </Text>

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
        borderBottomWidth: 0.3,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        padding: 5,
        marginBottom: 10,
        flexDirection: 'row',
        gap: 20,
    },

    deFlex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
    },
    deRow: {
        flexDirection: 'column',

    },

    icon: {

        backgroundColor: 'rgba(2, 42, 155, 0.2)',
        borderRadius: 8,
        padding: 4
    },
    Date: {
        fontSize: 12
    },
    verMas: {
        color: '#022a9b',
        fontSize: 13
    }

});
