import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, Text, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import HomeComponent from '../components/HomeComponent';
import Actividad from '../components/Actividad';
import Saldo from '../components/Saldo';
import { AntDesign } from '@expo/vector-icons';
import NotasHome from '../components/NotasHome';
import { Animated, Easing } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Grafica from '../components/Grafica';
import Grafica2 from '../components/Grafica2';
import { Feather } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

export default function Home() {
    const navigation = useNavigation();
    const [showHomeComponent, setShowHomeComponent] = useState(true);
    const [showActividad, setShowActividad] = useState(false);
    const [homeOpacity] = useState(new Animated.Value(0));
    const [actividadOpacity] = useState(new Animated.Value(0));
    const [homeTranslateY] = useState(new Animated.Value(100));
    const [actividadTranslateY] = useState(new Animated.Value(100));
    const [isGrafica1Visible, setIsGrafica1Visible] = useState(true);
    const isFocused = useIsFocused();
    const [actividades, setActividades] = useState([]);
    const [activeButton, setActiveButton] = useState('ingresos');

    const toggleGrafica = (button) => {
        setIsGrafica1Visible(!isGrafica1Visible);
        setActiveButton(button);
    };

    useEffect(() => {
        obtenerActividades();
    }, [isFocused]);

    const obtenerActividades = async () => {
        try {
            const actividadesGuardadas = await AsyncStorage.getItem('actividades');
            if (actividadesGuardadas) {
                const actividadesParseadas = JSON.parse(actividadesGuardadas);
                const actividadesInvertidas = actividadesParseadas.reverse();
                setActividades(actividadesInvertidas);
            }
        } catch (error) {
            console.log('Error al obtener las actividades:', error);
        }
    };

    const [animationValue] = useState(new Animated.Value(0));
    const startAnimation = () => {
        Animated.timing(animationValue, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    };

    useFocusEffect(
        React.useCallback(() => {
            startAnimation();
            return () => {
                animationValue.setValue(0);
            };
        }, [])
    );

    const translateY = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [200, 0],
    });

    useEffect(() => {
        animateComponent(showHomeComponent, homeOpacity, homeTranslateY);
        animateComponent(showActividad, actividadOpacity, actividadTranslateY);
    }, [showHomeComponent, showActividad]);

    const animateComponent = (show, opacityValue, translateYValue) => {
        Animated.parallel([
            Animated.timing(opacityValue, {
                toValue: show ? 1 : 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(translateYValue, {
                toValue: show ? 0 : 100,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const showHome = () => {
        setShowHomeComponent(true);
        setShowActividad(false);
    };

    const showActividadComponent = () => {
        setShowHomeComponent(false);
        setShowActividad(true);
    };

    return (
        <View contentContainerStyle={styles.scrollContaisner}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <LinearGradient colors={['#1FC2D7', '#CB6CE6',]} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonBtns}>
                            <TouchableOpacity
                                style={[styles.button, showHomeComponent && styles.activeButton]}
                                onPress={showHome}
                            >
                                <Text style={[styles.buttonText, showHomeComponent && styles.activeButtonText]}>Actividad</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, showActividad && styles.activeButton]}
                                onPress={showActividadComponent}
                            >
                                <Text style={[styles.buttonText, showActividad && styles.activeButtonText]}>Notas y más</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>

                <Animated.View style={[{ transform: [{ translateY }] }]}>
                    <Saldo />

                    <Animated.View style={[styles.componentContainer, { opacity: homeOpacity, transform: [{ translateY: homeTranslateY }] }]}>
                        {showHomeComponent && <Actividad />}
                    </Animated.View>

                    <Animated.View style={[styles.componentContainer2S, { opacity: actividadOpacity, transform: [{ translateY: actividadTranslateY }] }]}>
                        {showActividad && (
                            <View style={styles.componentContainer3}>
                                {actividades.length === 0 && (
                                    <View style={styles.componentContain}>
                                        <View style={styles.cambiarBtns}>
                                            <TouchableOpacity
                                                title="Cambiar gráfica"
                                                onPress={() => toggleGrafica('ingresos')}
                                                style={[styles.cambiar, activeButton === 'ingresos' && { backgroundColor: '#1FC2D7' }]}
                                            >
                                                <Text style={[styles.cambiarText, activeButton === 'ingresos' && { color: '#fff' }]}>
                                                    Ingresos
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                title="Cambiar gráfica"
                                                onPress={() => toggleGrafica('egresos')}
                                                style={[styles.cambiar, activeButton === 'egresos' && { backgroundColor: '#CB6CE6' }]}
                                            >
                                                <Text style={[styles.cambiarText, activeButton === 'egresos' && { color: '#fff' }]}>
                                                    Egresos
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        {isGrafica1Visible ? <Grafica /> : <Grafica2 />}
                                    </View>
                                )}

                                <View style={styles.componentContain2}>
                                    <NotasHome />
                                </View>


                            </View>
                        )}
                    </Animated.View>
                </Animated.View>

                <View style={styles.heig}>

                </View>
                <View style={styles.heig}>

                </View>
                <View style={styles.heig}>

                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

    scrollContaisner: {
        backgroundColor: '#f9f9f9',
    },
    scrollContainer: {
        flexGrow: 1,

        marginTop: 80,
        backgroundColor: '#f9f9f9',

    },
    scrollViewHome: {
        flex: 1,
        gap: 30,
    },
    buttonContainer: {
        padding: 20,
        marginTop: 20,
        width: '100%',
        height: 150

    },
    buttonBtns: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 20,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 35,
        borderRadius: 20,
    },
    activeButton: {
        backgroundColor: '#1FC2D7',
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
    },
    buttonText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: 'bold',
    },
    activeButtonText: {
        color: '#fff'
    },
    componentContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        margin: 15,
        opacity: 0,
        transform: [{ translateY: 100 }],
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 3,
    },
    componentContainer2: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        margin: 15,
        opacity: 0,
        transform: [{ translateY: 100 }],
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 3,
        marginTop: -33,

    },

    icon: {

        backgroundColor: 'rgba(2, 42, 155, 0.2)',
        backgroundColor: 'rgba(31, 194, 215, 0.1)',
        backgroundColor: 'rgba(203, 108, 230, 0.1)',
        borderRadius: 8,
        padding: 4
    },



    cambiar: {

        flexDirection: 'row',

        borderRadius: 20,

        alignItems: 'center',
        width: '50%',
        justifyContent: 'center'
    },
    cambiarText: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.6)',
        fontWeight: '600',
        padding: 8,
        textAlign: 'center'
    },
    cambiarBtns: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(31, 194, 215, 0.1)',
        borderRadius: 20,
        marginBottom: 20,

        margin: 15


    },
    componentContain: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        margin: 15,
        transform: [{ translateY: 100 }],
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 3,
        height: 320
    },

    componentContain2: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        margin: 15,
        transform: [{ translateY: 100 }],
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 3,

    },
    componentContainer3: {
        marginTop: -150
    },
    heig: {
        height: 90
    }
});
