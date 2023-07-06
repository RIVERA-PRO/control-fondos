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
import { MaterialCommunityIcons } from '@expo/vector-icons';
export default function NotasHome() {
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
            const notasGuardadas = await AsyncStorage.getItem('notas');
            if (notasGuardadas) {
                const notasParseadas = JSON.parse(notasGuardadas);
                const notasOrdenadas = notasParseadas.sort((a, b) => {
                    // Compara las fechas de creación de las notas para ordenarlas de forma descendente
                    return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
                });

                setNotas(notasOrdenadas);
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

    const colores = [
        'rgba(203, 108, 230, 0.2)',
        'rgba(108, 203, 230, 0.2)',
    ];
    const colores2 = [
        'rgba(203, 108, 230, 0.1)',
        'rgba(108, 203, 230, 0.1)',
    ];
    const goNotas = () => {
        navigation.navigate('NotasScreen');

    };
    if (notas.length === 0) {
        return (

            <Text style={styles.noHay}>No hay Notas</Text>



        )
    }


    return (
        <View style={styles.notasContainer}>
            <View style={styles.deFlex2}>
                <Text style={styles.Notas}>Notas</Text>

                <TouchableOpacity onPress={goNotas} style={styles.verMas}>
                    <Text style={styles.verMasText}>Ver más</Text>

                </TouchableOpacity>

            </View>

            <View style={styles.notasContainer}>
                {notas.slice(0, 6).map((nota, index) => (
                    <TouchableOpacity
                        style={[styles.nota, { backgroundColor: colores[index % colores.length] }]}
                        key={nota.id}
                        onPress={() => abrirModalEdicion(nota.id, nota.titulo, nota.nota)}
                    >
                        <MaterialIcons name="description" style={[styles.icon, { backgroundColor: colores2[index % colores2.length] },]} size={20} color='#CB6CE6' />
                        <View >

                            <View style={styles.deFlex}>

                                {nota.nota.length > 15 ? (
                                    <Text style={styles.titleTetxt}>{nota.titulo.slice(0, 15)}..</Text>
                                ) : (
                                    <Text style={styles.titleTetxt}>{nota.titulo}</Text>
                                )}


                                <Text style={styles.Date}>{new Date(nota.createdAt).toLocaleString()}</Text>

                            </View>

                            <View>
                                {nota.nota.length > 36 ? (
                                    <Text style={styles.notaText}>{nota.nota.slice(0, 36)}..</Text>
                                ) : (
                                    <Text style={styles.notaText}>{nota.nota}</Text>
                                )}
                            </View>


                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <Modal
                visible={editModalVisible}
                animationType="slide"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <ScrollView style={styles.modalContainer}>
                    <LinearGradient
                        colors={['#1FC2D7', '#CB6CE6']}
                        style={styles.container}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <View style={styles.headerAtras2}>
                            <TouchableOpacity
                                style={styles.atras}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <AntDesign name="arrowleft" size={24} color="#fff" />
                            </TouchableOpacity>

                        </View>
                    </LinearGradient>
                    <View style={styles.inputsEdit}>
                        <View style={styles.inputsFlex}>
                            <MaterialIcons
                                name="description"
                                size={20}
                                color="rgba(0, 0, 0, 0.3)"
                                style={styles.Icon}
                            />
                            <TextInput
                                value={edittitulo}
                                onChangeText={setEditTitulo}
                                placeholder="Titulo"
                                style={styles.inputEdit}
                                multiline={true} // Permite múltiples líneas de texto
                                numberOfLines={4} // Especifica el número inicial de líneas mostradas
                            />
                        </View>
                        <View style={styles.inputsFlex}>
                            <MaterialIcons
                                name="description"
                                size={20}
                                color="rgba(0, 0, 0, 0.3)"
                                style={styles.Icon2}

                            />
                            <TextInput
                                value={editNota}
                                onChangeText={setEditNota}
                                placeholder="Nota"
                                style={styles.inputEdit}
                                multiline={true} // Permite múltiples líneas de texto
                                numberOfLines={4} // Especifica el número inicial de líneas mostradas
                            />
                        </View>
                    </View>
                    <View style={styles.deFlexButon}>
                        <TouchableOpacity
                            style={styles.buttonGuardar}
                            onPress={() => guardarEdicion()}
                        >
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                        <View style={styles.deFlex2}>
                            <TouchableOpacity
                                style={styles.buttonEliminar}

                                onPress={() => eliminarNota()}
                            >
                                <Text style={styles.buttonText}>Eliminar</Text>

                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    notasContainer: {




    },
    nota: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginTop: 15,
        padding: 10,
        borderRadius: 10,

    },
    containerBG: {

    },
    deFlex: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 7
    },

    notaText: {
        fontSize: 13,
        color: 'rgba(0, 0, 0, 0.6)',

    },
    titleTetxt: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.6)',
        fontWeight: '600',
        width: 120
    },
    icon: {

        backgroundColor: 'rgba(2, 42, 155, 0.2)',
        backgroundColor: 'rgba(31, 194, 215, 0.1)',
        backgroundColor: 'rgba(203, 108, 230, 0.1)',
        borderRadius: 8,
        padding: 4
    },
    Date: {
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 12
    },
    headerAtras2: {
        flexDirection: 'row',
        paddingTop: 30,
        padding: 20,
        justifyContent: 'space-between',
    },

    inputsEdit: {
        padding: 20
    },
    inputsFlex: {
        flexDirection: 'row',


        paddingHorizontal: 10,
        marginBottom: 10,
        width: '100%',
        backgroundColor: 'rgba(203, 108, 230, 0.1)',

        borderRadius: 7,
        padding: 10,
        marginTop: 10,
        borderBottomWidth: 0.3,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },

    inputEdit: {
        paddingHorizontal: 10,
        justifyContent: 'center',

    },
    Icon: {
        paddingTop: 24
    },
    Icon2: {
        paddingTop: 24
    },
    deFlexButon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        margin: 20
    },
    buttonEliminar: {
        backgroundColor: '#CB6CE6',
        padding: 10,
        borderRadius: 20,
        width: 150,
        textAlign: 'center',
        justifyContent: 'center',
    },
    buttonGuardar: {
        backgroundColor: '#1FC2D7',
        padding: 10,
        borderRadius: 20,
        width: 150,
        textAlign: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16
    },
    noHay: {
        flexGrow: 1,
        textAlign: 'center',
        justifyContent: 'center',
        paddingTop: 200
    },
    deFlex2: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    Notas: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.6)',
        fontWeight: '600'
    },
    verMas: {
        fontSize: 13,
        color: 'rgba(0, 0, 0, 0.6)',
        fontWeight: '600',
        flexDirection: 'row',
        alignItems: 'center',

    },
    verMasText: {
        fontSize: 13,
        color: 'rgba(0, 0, 0, 0.6)',
        fontWeight: '600',
        flexDirection: 'row',
        alignItems: 'center',

    },
})