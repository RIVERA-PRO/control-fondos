import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TextInput,
    Button,

} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dialog } from "react-native-popup-dialog";
export default function Mas() {
    const [monto, setMonto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoria, setCategoria] = useState('Ingreso');
    const [formularioActual, setFormularioActual] = useState('Ingreso');
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
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
            <View style={styles.container}>
                <View style={styles.buttonsContainer}>
                    <Button
                        title="Ingreso"
                        onPress={mostrarFormularioIngreso}
                        color={formularioActual === 'Ingreso' ? 'red' : 'gray'}
                    />
                    <Button
                        title="Egreso"
                        onPress={mostrarFormularioEgreso}
                        color={formularioActual === 'Egreso' ? 'red' : 'gray'}
                    />
                </View>

                {formularioActual === 'Ingreso' && (
                    <View>
                        <Text>Monto:</Text>
                        <TextInput
                            style={styles.input}
                            value={monto}
                            onChangeText={setMonto}
                            keyboardType="numeric"

                        />
                        <Text>Descripción:</Text>
                        <TextInput
                            style={styles.input}
                            value={descripcion}
                            onChangeText={setDescripcion}
                        />
                    </View>
                )}

                {formularioActual === 'Egreso' && (
                    <View>
                        <Text>Monto:</Text>
                        <TextInput
                            style={styles.input}
                            value={monto}
                            onChangeText={setMonto}
                            keyboardType="numeric"
                        />
                        <Text>Descripción:</Text>
                        <TextInput
                            style={styles.input}
                            value={descripcion}
                            onChangeText={setDescripcion}
                        />
                    </View>
                )}

                <Button title="Guardar actividad" onPress={crearActividad} />
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
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 100,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    agregado: {
        padding: 20,

    },

});
