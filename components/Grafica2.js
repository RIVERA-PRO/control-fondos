import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Animated, Easing } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
export default function Grafica2() {
    const isFocused = useIsFocused();
    const [actividades, setActividades] = useState([]);
    const [montos, setMontos] = useState([]);
    const [fechas, setFechas] = useState([]);
    const [sumaMontos, setSumaMontos] = useState(0); // Variable para almacenar la suma total de los montos de ingreso

    const navigation = useNavigation();
    const [animationValue] = useState(new Animated.Value(0));
    const startAnimation = () => {
        Animated.timing(animationValue, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    };

    useFocusEffect(
        React.useCallback(() => {
            startAnimation();
            return () => {
                // Reinicia la animación cuando la pantalla pierde el foco
                animationValue.setValue(0);
            };
        }, [])
    );

    const translateY = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [200, 0], // Inicia desde 200 unidades hacia abajo y se desplaza hacia arriba
    });
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
                    if (actividad.categoria === 'Egreso') {
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
        if (actividades.filter(actividad => actividad.categoria === 'Egreso').length === 0) {
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
                    <Animated.View style={[{ transform: [{ translateY }] }]}>

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
                    </Animated.View>
                </ScrollView>
            </View>
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>

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
        backgroundColor: '#CB6CE6',
        width: 50,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        marginRight: 10,
    },
    etiquetaBarra: {
        fontSize: 9,
        color: 'white',
        textAlign: 'center',
        marginTop: 1,
    },
    fechasContainer: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 2,
        bottom: -14.5,
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

});
