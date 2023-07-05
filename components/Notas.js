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
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dialog } from "react-native-popup-dialog";
import Header from '../components/Header';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
export default function Notas() {
    const [titulo, setTitulo] = useState('')
    const [notaText, setNotaText] = useState('')
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const navigation = useNavigation();
    const crearNota = async () => {
        if (titulo === '' || notaText === '') {
            console.log('los campos no pueden estar vacios')
            setShowAlertError(true)
            return
        }

        try {

            const nota = {
                id: new Date().getTime().toString(),
                titulo: titulo,
                nota: notaText,
                createdAt: new Date(),
            }

            let notas = await AsyncStorage.getItem('notas')
            notas = notas ? JSON.parse(notas) : [];

            notas.push(nota)

            console.log(nota)
            await AsyncStorage.setItem('notas', JSON.stringify(notas))
            setTitulo('')
            setNotaText('')
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                navigation.navigate('NotasScreen');
            }, 1000);

        } catch (error) {
            console.log(error)

        }
    }


    return (
        <View style={styles.form}>


            <View style={styles.inputsFlex}>
                <MaterialIcons name="description" size={20} color='rgba(0, 0, 0, 0.3)' />
                <TextInput
                    style={styles.input}
                    value={titulo}
                    placeholder='Titulo'
                    onChangeText={setTitulo}
                />
            </View>

            <View style={styles.inputsFlex}>
                <MaterialIcons name="description" size={20} color='rgba(0, 0, 0, 0.3)' />
                <TextInput
                    style={styles.input}
                    value={notaText}
                    placeholder='Nota'
                    onChangeText={setNotaText}
                />
            </View>

            <TouchableOpacity
                style={styles.guardar}
                onPress={crearNota}
            >
                <Text style={styles.guardarText}>
                    Guardar
                </Text>
            </TouchableOpacity>

            <Dialog
                visible={showAlert}
                onTouchOutside={() => setShowAlert(false)}

            >
                <View style={styles.agregado}>
                    <Text>Nota Creada!</Text>
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
        </View>
    )
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
        marginTop: 100
    },
    input: {
        paddingHorizontal: 10,
        width: '90%'
    },
    agregado: {
        padding: 20,

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
    guardar: {
        backgroundColor: '#1FC2D7',
        padding: 12,
        borderRadius: 20,
        margin: 20
    },
    guardarText: {
        textAlign: 'center',
        color: '#FFf'

    },

})