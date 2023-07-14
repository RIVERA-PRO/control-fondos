import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, Text, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeComponent() {
    const isFocused = useIsFocused();
    const [actividades, setActividades] = useState([]);
    const [montoTotalSemana, setMontoTotalSemana] = useState(0);
    const [montoTotalMes, setMontoTotalMes] = useState(0);
    const [montoTotalSemana2, setMontoTotalSemana2] = useState(0);
    const [montoTotalMes2, setMontoTotalMes2] = useState(0);
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
                const actividadesInvertidas = actividadesParseadas.reverse(); // Invertir el orden de las actividades
                console.log(actividadesInvertidas);
                setActividades(actividadesInvertidas);

                // Calcular el monto total de actividades de tipo "Ingreso" por semana y mes
                const ingresosPorSemana = calcularMontoPorSemana(actividadesInvertidas);
                const ingresosPorMes = calcularMontoPorMes(actividadesInvertidas);
                const ingresosPorSemana2 = calcularMontoPorSemana2(actividadesInvertidas);
                const ingresosPorMes2 = calcularMontoPorMes2(actividadesInvertidas);
                setMontoTotalSemana(ingresosPorSemana);
                setMontoTotalMes(ingresosPorMes);
                setMontoTotalSemana2(ingresosPorSemana2);
                setMontoTotalMes2(ingresosPorMes2);
                console.log('Ingresos por semana:', ingresosPorSemana);
                console.log('Ingresos por mes:', ingresosPorMes);
            }
        } catch (error) {
            console.log('Error al obtener las actividades:', error);
        }
    };

    const calcularMontoPorSemana = (actividades) => {
        const fechaActual = new Date();
        const unaSemana = 7 * 24 * 60 * 60 * 1000; // Milisegundos en una semana
        const actividadesIngreso = actividades.filter((actividad) => actividad.categoria === 'Ingreso');

        let montoTotalSemana = 0;
        for (let i = 0; i < actividadesIngreso.length; i++) {
            const actividad = actividadesIngreso[i];
            const fechaActividad = new Date(actividad.createdAt);

            if (fechaActual - fechaActividad <= unaSemana) {
                montoTotalSemana += actividad.monto;
            } else {
                // Las actividades están ordenadas por fecha en orden descendente,
                // por lo que podemos salir del bucle cuando encontramos una actividad
                // más antigua de una semana.
                break;
            }
        }

        return montoTotalSemana;
    };


    const calcularMontoPorSemana2 = (actividades) => {
        const fechaActual = new Date();
        const unaSemana = 7 * 24 * 60 * 60 * 1000; // Milisegundos en una semana
        const actividadesIngreso = actividades.filter((actividad) => actividad.categoria === 'Egreso');

        let montoTotalSemana2 = 0;
        for (let i = 0; i < actividadesIngreso.length; i++) {
            const actividad = actividadesIngreso[i];
            const fechaActividad = new Date(actividad.createdAt);

            if (fechaActual - fechaActividad <= unaSemana) {
                montoTotalSemana2 += actividad.monto;
            } else {
                // Las actividades están ordenadas por fecha en orden descendente,
                // por lo que podemos salir del bucle cuando encontramos una actividad
                // más antigua de una semana.
                break;
            }
        }

        return montoTotalSemana2;
    };
    const calcularMontoPorMes = (actividades) => {
        const fechaActual = new Date();
        const unMes = 30 * 24 * 60 * 60 * 1000; // Milisegundos en un mes
        const actividadesIngreso = actividades.filter((actividad) => actividad.categoria === 'Ingreso');

        let montoTotalMes = 0;
        for (let i = 0; i < actividadesIngreso.length; i++) {
            const actividad = actividadesIngreso[i];
            const fechaActividad = new Date(actividad.createdAt);

            if (fechaActual - fechaActividad <= unMes) {
                montoTotalMes += actividad.monto;
            } else {
                // Las actividades están ordenadas por fecha
                break;
            }
        }

        return montoTotalMes;
    };
    const calcularMontoPorMes2 = (actividades) => {
        const fechaActual = new Date();
        const unMes = 30 * 24 * 60 * 60 * 1000; // Milisegundos en un mes
        const actividadesIngreso = actividades.filter((actividad) => actividad.categoria === 'Egreso');

        let montoTotalMes2 = 0;
        for (let i = 0; i < actividadesIngreso.length; i++) {
            const actividad = actividadesIngreso[i];
            const fechaActividad = new Date(actividad.createdAt);

            if (fechaActual - fechaActividad <= unMes) {
                montoTotalMes2 += actividad.monto;
            } else {
                // Las actividades están ordenadas por fecha
                break;
            }
        }

        return montoTotalMes2;
    };
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer2}>
            <View>
                <Text>Monto total por semana: {montoTotalSemana.toLocaleString()}</Text>

                <Text>Monto total por mes: {montoTotalMes}</Text>

                <Text>Monto total por semana: {montoTotalSemana2}</Text>
                <Text>Monto total por mes: {montoTotalMes2}</Text>
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