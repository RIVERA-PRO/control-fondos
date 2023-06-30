import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, Text, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import HomeComponent from '../components/HomeComponent';
import Actividad from '../components/Actividad';
import Saldo from '../components/Saldo';
import { AntDesign } from '@expo/vector-icons';

export default function Home() {
    const navigation = useNavigation();
    const [showHomeComponent, setShowHomeComponent] = useState(true);
    const [showActividad, setShowActividad] = useState(false);
    const [homeOpacity] = useState(new Animated.Value(0));
    const [actividadOpacity] = useState(new Animated.Value(0));
    const [homeTranslateY] = useState(new Animated.Value(100));
    const [actividadTranslateY] = useState(new Animated.Value(100));

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
                            <Text style={[styles.buttonText, showActividad && styles.activeButtonText]}>Home Mostrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Saldo />

                <Animated.View style={[styles.componentContainer, { opacity: homeOpacity, transform: [{ translateY: homeTranslateY }] }]}>
                    {showHomeComponent && <Actividad />}
                </Animated.View>
                <Animated.View style={[styles.componentContainer, { opacity: actividadOpacity, transform: [{ translateY: actividadTranslateY }] }]}>
                    {showActividad && <HomeComponent />}
                </Animated.View>
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        height: '120%',
        marginTop: 80,
        backgroundColor: '#fff',

    },
    scrollViewHome: {
        flex: 1,
        gap: 30,
    },
    buttonContainer: {
        backgroundColor: '#022a9b',

        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginTop: 20,
        width: '100%',

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
        backgroundColor: '#022a9b',

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
        margin: 10,
        opacity: 0,
        transform: [{ translateY: 100 }],
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
    },
});
