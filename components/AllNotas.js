import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TextInput,
    Button,
    TouchableOpacity,
    Animated,
    Modal

} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dialog } from "react-native-popup-dialog";
import Header from '../components/Header';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons';
export default function AllNotas() {
    const isFocused = useIsFocused();
    const [notas, setNotas] = useState([]);
    const navigation = useNavigation();

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [edittitulo, setEditTitulo] = useState('');
    const [editNota, setEditNota] = useState('');
    const [editNotaId, setEditNotaId] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);




    useEffect(() => {
        ObtenerNotas()
    }, [isFocused])

    const ObtenerNotas = async () => {
        try {
            const notasGuradadas = await AsyncStorage.getItem('notas')
            if (notasGuradadas) {
                const notasParseadas = JSON.parse(notasGuradadas)
                const notasInvertidas = notasParseadas.reverse()

                setNotas(notasInvertidas)

            }
        } catch (error) {
            console.log('Error al obtener las notas:', error);
        }
    }

    const abrirModalEdicion = (id, titulo, nota) => {
        setEditModalVisible(true);
        setEditTitulo(titulo);
        setEditNota(nota);
        setEditNotaId(id);
    };

    const guardarEdicion = async () => {
        try {
            const notasGuardadas = await AsyncStorage.getItem('notas');
            if (notasGuardadas) {
                const notasParseadas = JSON.parse(notasGuardadas);
                const nuevasNotas = notasParseadas.map((nota) => {
                    if (nota.id === editNotaId) {
                        return {
                            ...nota,
                            titulo: edittitulo,
                            nota: editNota,
                        };
                    }
                    return nota;
                });
                await AsyncStorage.setItem(
                    'notas',
                    JSON.stringify(nuevasNotas)
                );
                setNotas(nuevasNotas);
                setEditModalVisible(false);
            }
        } catch (error) {
            console.log('Error al guardar la edición:', error);
        }
    };
    const eliminarNota = async () => {
        try {
            const notasGuardadas = await AsyncStorage.getItem('notas');
            if (notasGuardadas) {
                const notasParseadas = JSON.parse(notasGuardadas);
                const nuevasNotas = notasParseadas.filter(
                    (nota) => nota.id !== editNotaId
                );
                await AsyncStorage.setItem('notas', JSON.stringify(nuevasNotas));
                setNotas(nuevasNotas);
                setEditModalVisible(false);
                setDeleteModalVisible(false);
            }
        } catch (error) {
            console.log('Error al eliminar la nota:', error);
        }
    };
    const borrarTodasNotas = async () => {
        try {
            await AsyncStorage.removeItem('notas');
            setNotas([]);
        } catch (error) {
            console.log('Error al borrar todas las notas:', error);
        }
    };
    const goToNotas = () => {
        navigation.navigate('FormNotas');

    };
    if (notas.length === 0) {
        return (
            <View>
                <Text>No hay actividades</Text>
                <TouchableOpacity
                    style={styles.Agregar}

                >
                    <Text style={styles.buttosnText}>Agregar </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.borrarTodasNotasButton}
                    onPress={() => goToNotas()}
                >
                    <Text style={styles.borrarTodasNotasButtonText}>Crear nota</Text>
                </TouchableOpacity>
            </View>
        )
    }



    return (
        <View>
            <LinearGradient colors={['#1FC2D7', '#CB6CE6',]} style={styles.containerBG} start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>

                <View style={styles.deFlex}>
                    <TouchableOpacity
                        style={styles.borrarTodasNotasButton}
                        onPress={() => borrarTodasNotas()}
                    >
                        <Text style={styles.borrarTodasNotasButtonText}>Borrar todas las notas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.borrarTodasNotasButton}
                        onPress={() => goToNotas()}
                    >
                        <Text style={styles.borrarTodasNotasButtonText}>Crear nota</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
            <View style={styles.notasContainer}>
                {notas.map((nota) => (


                    <TouchableOpacity style={styles.nota} key={nota.id} onPress={() =>
                        abrirModalEdicion(nota.id, nota.titulo, nota.nota)
                    }>
                        <Text style={styles.titleTetxt}>{nota.titulo.slice(0, 15)} </Text>
                        <Text style={styles.notaText}>{nota.nota.slice(0, 60)} </Text>
                    </TouchableOpacity>


                ))}
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    notasContainer: {


        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    nota: {
        backgroundColor: 'rgba(203, 108, 230, 0.2)',
        margin: 10,
        width: '44%',
        height: 140,
        padding: 10,
        borderRadius: 10,

    },
    containerBG: {

    },
    deFlex: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        paddingTop: 20
    },


})