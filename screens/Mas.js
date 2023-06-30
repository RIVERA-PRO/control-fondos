import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TextInput,
    Button,
    TouchableOpacity,
    Animated

} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dialog } from "react-native-popup-dialog";
import Header from '../components/Header';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
export default function Mas() {
    const [monto, setMonto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoria, setCategoria] = useState('Ingreso');
    const [formularioActual, setFormularioActual] = useState('Ingreso');
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [homeOpacity] = useState(new Animated.Value(0));
    const [actividadOpacity] = useState(new Animated.Value(0));
    const [homeTranslateY] = useState(new Animated.Value(100));
    const [actividadTranslateY] = useState(new Animated.Value(100));
    const [showHomeComponent, setShowHomeComponent] = useState(true);
    const [showActividad, setShowActividad] = useState(false);
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
    const crearActividad = async () => {
        if (monto === '' || descripcion === '') {
            console.log('Todos los campos son requeridos');
            setShowAlertError(true);
            return;
        }

        try {
            const actividad = {
                id: new Date().getTime().toString(),
                categoria,
                monto: parseFloat(monto),
                descripcion,
                createdAt: new Date(),
            };

            let actividades = await AsyncStorage.getItem('actividades');
            actividades = actividades ? JSON.parse(actividades) : [];

            actividades.push(actividad);

            await AsyncStorage.setItem('actividades', JSON.stringify(actividades));

            // Limpia los campos después de guardar la actividad
            setMonto('');
            setDescripcion('');
            setShowAlert(true);
        } catch (error) {
            console.log('Error al guardar la actividad:', error);
        }
    };


    const mostrarFormularioIngreso = () => {
        setFormularioActual('Ingreso');
        setCategoria('Ingreso');
    };

    const mostrarFormularioEgreso = () => {
        setFormularioActual('Egreso');
        setCategoria('Egreso');
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Header />
            <View style={styles.container}>
                <View style={styles.buttonsContainer}>
                    <View style={styles.buttonBtns}>
                        <TouchableOpacity
                            style={[
                                styles.button, showHomeComponent,
                                formularioActual === 'Ingreso' && { backgroundColor: '#022a9b' },
                            ]}
                            onPress={() => {
                                mostrarFormularioIngreso();
                                showHome();
                            }}
                        >
                            <Text style={styles.buttonText}>Ingreso</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button, showActividad,
                                formularioActual === 'Egreso' && { backgroundColor: '#022a9b' },
                            ]}
                            onPress={() => {
                                mostrarFormularioEgreso();
                                showActividadComponent();
                            }}
                        >
                            <Text style={styles.buttonText}>Egreso</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Animated.View style={[styles.componentContainer, { opacity: homeOpacity, transform: [{ translateY: homeTranslateY }] }]}>
                    {showHomeComponent && formularioActual === 'Ingreso' && (
                        <View style={styles.form}>

                            <View style={styles.inputsFlex}>
                                <FontAwesome name="dollar" size={20} color='rgba(0, 0, 0, 0.3)' style={styles.Icon} />
                                <TextInput
                                    style={styles.input}
                                    value={monto}
                                    onChangeText={setMonto}
                                    keyboardType="numeric"
                                    placeholder="Monto"
                                />
                            </View>


                            <View style={styles.inputsFlex}>
                                <MaterialIcons name="description" size={20} color='rgba(0, 0, 0, 0.3)' />
                                <TextInput
                                    style={styles.input}
                                    value={descripcion}
                                    onChangeText={setDescripcion}
                                    placeholder="Descripcion"
                                />
                            </View>
                        </View>
                    )}
                </Animated.View>


                <Animated.View style={[styles.componentContainer, { opacity: actividadOpacity, transform: [{ translateY: actividadTranslateY }] }]}>
                    {showActividad && formularioActual === 'Egreso' && (
                        <View style={styles.form}>

                            <View style={styles.inputsFlex}>
                                <FontAwesome name="dollar" size={20} color='rgba(0, 0, 0, 0.3)' style={styles.Icon} />
                                <TextInput
                                    style={styles.input}
                                    value={monto}
                                    onChangeText={setMonto}
                                    keyboardType="numeric"
                                    placeholder="Monto"
                                />
                            </View>


                            <View style={styles.inputsFlex}>
                                <MaterialIcons name="description" size={20} color='rgba(0, 0, 0, 0.3)' style={styles.Icon} />
                                <TextInput
                                    style={styles.input}
                                    value={descripcion}
                                    onChangeText={setDescripcion}
                                    placeholder="Descripcion"
                                />
                            </View>
                        </View>
                    )}
                </Animated.View>
                <TouchableOpacity
                    style={[
                        styles.guardar, showActividad,
                        formularioActual === 'Egreso' && { backgroundColor: '#022a9b' },
                    ]}
                    onPress={crearActividad}
                >
                    <Text style={styles.guardarText}>Guardar</Text>
                </TouchableOpacity>

            </View>
            <Dialog
                visible={showAlert}
                onTouchOutside={() => setShowAlert(false)}

            >
                <View style={styles.agregado}>
                    <Text>¡Actividad Creada!</Text>
                </View>
            </Dialog>


            <Dialog
                visible={showAlertError}
                onTouchOutside={() => setShowAlertError(false)}
            >
                <View style={styles.agregado}>
                    <Text>Todos los campos son requeridos! </Text>
                </View>
            </Dialog>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    form: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        margin: 10,


        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        paddingTop: 80,
        backgroundColor: '#fff',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        backgroundColor: '#022a9b',
        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginTop: 20,
        width: '100%',
    },
    input: {
        paddingHorizontal: 10,
        width: '90%'
    },
    agregado: {
        padding: 20,

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
    buttonText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: 'bold',
    },
    guardar: {
        backgroundColor: '#022a9b',
        padding: 12,
        borderRadius: 20,
        margin: 20
    },
    guardarText: {
        textAlign: 'center',
        color: '#FFf'

    },
    inputsFlex: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 10,
        marginBottom: 10,
        width: '100%',
        backgroundColor: ' rgba(211, 211, 211, 0.3)',
        borderRadius: 20,
        padding: 10

    },
    Icon: {
        width: 30
    }


});
