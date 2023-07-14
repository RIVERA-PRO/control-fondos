import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

export default function GraficaHome() {
    const isFocused = useIsFocused();
    const [actividades, setActividades] = useState([]);
    const [montos, setMontos] = useState([]);
    const [fechas, setFechas] = useState([]);
    const [sumaMontos, setSumaMontos] = useState(0); // Variable para almacenar la suma total de los montos de ingreso

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
                setActividades(actividadesInvertidas);

                // Obtener montos y fechas de las actividades de tipo "Ingreso"
                const montosIngreso = [];
                const fechasIngreso = [];
                actividadesInvertidas.forEach((actividad) => {
                    if (actividad.categoria === 'Ingreso') {
                        montosIngreso.push(actividad.monto);
                        fechasIngreso.push(actividad.createdAt);
                    }
                });

                // Calcular la suma total de los montos de ingreso
                const sumaMontosIngreso = montosIngreso.reduce((accumulator, current) => accumulator + current, 0);
                setSumaMontos(sumaMontosIngreso);

                setMontos(montosIngreso);
                setFechas(fechasIngreso);
            }
        } catch (error) {
            console.log('Error al obtener las actividades:', error);
        }
    };
    const goToGraficas = () => {
        navigation.navigate('Graficas');

    };
    const renderGrafica = () => {
        const montoMaximo = Math.max(...montos);
        const alturaMaxima = 192;
        const proporcion = alturaMaxima / (montoMaximo - 2000);
        if (actividades.filter(actividad => actividad.categoria === 'Ingreso').length === 0) {
            return (
                <View style={styles.scrollContainerSinActividad}>
                    {/* Aquí puedes agregar el contenido que deseas mostrar */}
                </View>
            );
        }
        return (
            <View style={styles.graficaContainer}>
                <ScrollView style={styles.ejeY} contentContainerStyle={styles.montosContainer}>
                    {/* Etiquetas de los montos */}
                    {[...Array(6)].map((_, index) => {
                        const monto = montoMaximo - (index / 5) * (montoMaximo - 5000); // Restamos 1000 al monto máximo
                        return (
                            <Text key={index} style={styles.etiquetaMonto}>
                                {monto.toLocaleString('es-AR', {
                                    style: 'currency',
                                    currency: 'ARS',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                })}
                            </Text>
                        );
                    })}
                </ScrollView>

                <ScrollView horizontal>
                    <View style={styles.barContainer}>
                        {/* Barras de la gráfica */}
                        {montos.map((monto, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.barra,
                                    { height: monto * proporcion },
                                ]}
                            >
                                <Text style={styles.etiquetaBarra}>
                                    {monto.toLocaleString('es-AR', {
                                        style: 'currency',
                                        currency: 'ARS',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    })}
                                </Text>
                            </View>
                        ))}
                        <View style={styles.fechasContainer}>
                            {fechas.map((fecha, index) => (
                                <Text key={index} style={styles.etiquetaFecha}>
                                    {new Date(fecha).toLocaleDateString('es-AR')}
                                </Text>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.deFlex} >
                <View style={styles.deFlex} >
                    <Feather name="arrow-up-right" size={18} color='#CB6CE6' style={styles.icon} />
                    <Text style={styles.sumaTotal}>+ $ {sumaMontos.toLocaleString()}</Text>
                </View>

                <TouchableOpacity onPress={goToGraficas} style={styles.verMas}>
                    <Text style={styles.verMasText}>Ver más</Text>

                </TouchableOpacity>
            </View>
            {renderGrafica()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        gap: 30
    },
    graficaContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 210,
        marginBottom: 20,
    },
    ejeY: {
        width: 90,
    },
    montosContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: '100%',
        bottom: 5,
    },
    etiquetaMonto: {
        fontSize: 11,
        color: 'gray',
    },
    barContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 23,
        zIndex: 1,
    },
    barra: {
        backgroundColor: '#1FC2D7',
        width: 50,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        marginRight: 10,
    },
    etiquetaBarra: {
        fontSize: 9,
        color: 'white',
        textAlign: 'center',
        marginTop: 4,
    },
    fechasContainer: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 2,
        bottom: -16,
    },
    etiquetaFecha: {
        fontSize: 10.5,
        color: 'gray',
        marginRight: 8.4,
        width: 52,
    },

    icon: {
        backgroundColor: 'rgba(203, 108, 230, 0.1)',
        borderRadius: 8,
        padding: 2
    },
    deFlex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5
    },
    verMasText: {
        fontSize: 13,
        color: 'rgba(0, 0, 0, 0.6)',
        fontWeight: '600',
        flexDirection: 'row',
        alignItems: 'center',

    },
    sumaTotal: {
        color: 'green'
    }
});
