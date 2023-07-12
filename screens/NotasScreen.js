import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TextInput,
    Button,
    TouchableOpacity,


} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dialog } from "react-native-popup-dialog";
import Header from '../components/Header';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Notas from '../components/Notas';
import AllNotas from '../components/AllNotas';
import { useNavigation } from '@react-navigation/native';
import { Animated, Easing } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
export default function NotasScreen() {
    const navigation = useNavigation();
    const [showHomeComponent, setShowHomeComponent] = useState(true);
    const [showActividad, setShowActividad] = useState(false);
    const [homeOpacity] = useState(new Animated.Value(0));
    const [actividadOpacity] = useState(new Animated.Value(0));
    const [homeTranslateY] = useState(new Animated.Value(100));
    const [actividadTranslateY] = useState(new Animated.Value(100));

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
        <View style={styles.containerbg} >
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContainer2}>

                <LinearGradient colors={['#1FC2D7', '#CB6CE6',]} style={styles.buttonContainer} start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}>
                    <View >
                        <View style={styles.buttonBtns}>
                            <TouchableOpacity
                                style={[styles.button, showHomeComponent && styles.activeButton]}
                                onPress={showHome}
                            >
                                <Text style={[styles.buttonText, showHomeComponent && styles.activeButtonText]}>       Notas      </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, showActividad && styles.activeButton]}
                                onPress={showActividadComponent}
                            >
                                <Text style={[styles.buttonText, showActividad && styles.activeButtonText]}>       Añadir       </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
                <Animated.View style={[{ transform: [{ translateY }] }]}>


                    <Animated.View style={[styles.componentContainer, { opacity: homeOpacity, transform: [{ translateY: homeTranslateY }] }]}>
                        {showHomeComponent && <AllNotas />}
                    </Animated.View>
                    <Animated.View style={[styles.componentContainer, { opacity: actividadOpacity, transform: [{ translateY: actividadTranslateY }] }]}>
                        {showActividad && <Notas />}
                    </Animated.View>
                </Animated.View>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({

    containerbg: {
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    scrollContainer2: {

        marginTop: 80,
        backgroundColor: '#fff',


    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
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

        opacity: 0,
        transform: [{ translateY: 100 }],

    },

})