import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Dialog } from "react-native-popup-dialog";
import { LinearGradient } from 'expo-linear-gradient';
export default function Detail() {
    const route = useRoute();
    const { actividad } = route.params;
    const [monto, setMonto] = useState(actividad.monto.toString());
    const [descripcion, setDescripcion] = useState(actividad.descripcion);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const [tipo, setTipo] = useState(actividad.tipo);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);


    const handleEditar = async () => {
        try {
            if (monto.trim() === '' || descripcion.trim() === '') {
                console.log('Todos los campos son requeridos');
                setShowAlertError(true);
                setTimeout(() => {
                    setShowAlertError(false);
                }, 600);
                return;
            }

            // Obtener las actividades almacenadas
            const actividadesGuardadas = await AsyncStorage.getItem('actividades');
            if (actividadesGuardadas) {
                const actividadesParseadas = JSON.parse(actividadesGuardadas);

                // Encontrar la actividad correspondiente y actualizar los valores
                const actividadesActualizadas = actividadesParseadas.map((act) => {
                    if (act.id === actividad.id) {
                        return {
                            ...act,
                            monto: parseFloat(monto),
                            descripcion,
                            tipo,
                        };
                    }
                    return act;
                });

                // Guardar las actividades actualizadas en AsyncStorage
                await AsyncStorage.setItem('actividades', JSON.stringify(actividadesActualizadas));



                // Regresar a la pantalla anterior
                navigation.navigate('Actividades');
            }
        } catch (error) {
            console.log('Error al editar la actividad:', error);
        }
    };


    const goToActividades = () => {
        navigation.navigate('Actividades');

    };

    const handleEliminar = async () => {
        try {
            // Obtener las actividades almacenadas
            const actividadesGuardadas = await AsyncStorage.getItem('actividades');
            if (actividadesGuardadas) {
                const actividadesParseadas = JSON.parse(actividadesGuardadas);

                // Filtrar las actividades y eliminar la actividad correspondiente
                const actividadesActualizadas = actividadesParseadas.filter((act) => act.id !== actividad.id);

                // Guardar las actividades actualizadas en AsyncStorage
                await AsyncStorage.setItem('actividades', JSON.stringify(actividadesActualizadas));
            }
        } catch (error) {
            console.log('Error al eliminar la actividad:', error);
        }

        // Regresar a la pantalla anterior
        navigation.goBack();
    };
    useEffect(() => {
        // Actualizar los valores iniciales de monto y descripcion cuando se cargue la actividad
        setMonto(actividad.monto.toString());
        setDescripcion(actividad.descripcion);
        setTipo(actividad.tipo);
    }, [actividad]);

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#1FC2D7', '#CB6CE6',]} start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <View style={styles.headerAtras} >
                    <TouchableOpacity style={styles.atras} onPress={goToActividades}>
                        <AntDesign name="arrowleft" size={24} color="#fff" />
                    </TouchableOpacity>

                </View>
            </LinearGradient>
            <View style={styles.headerAtras2} >
                <Text
                    style={{
                        color: actividad?.categoria === 'Ingreso' ? 'green' : 'red',
                        fontSize: 24,
                        textAlign: 'center',


                    }}
                >
                    {actividad.categoria === 'Egreso' && '- '}
                    $ {actividad.monto.toLocaleString().slice(0, 13)}
                </Text>

            </View>

            <View style={styles.containerDetail}>
                <View style={styles.deFlex}>
                    <View style={styles.deFlex2}>
                        <MaterialIcons name="category" style={styles.Icon} size={20} color="#CB6CE6" />
                        <Text>Categoria:</Text>
                    </View>
                    <View style={styles.deFlex2}>
                        <Text>{actividad?.categoria}</Text>
                    </View>
                </View>
                <View style={styles.deFlex}>
                    <View style={styles.deFlex2}>
                        <MaterialIcons name="date-range" style={styles.Icon} size={20} color="#CB6CE6" />
                        <Text>Fecha:</Text>
                    </View>
                    <View style={styles.deFlex2}>
                        <Text>{new Date(actividad.createdAt).toLocaleString()}</Text>
                    </View>
                </View>
                <View style={styles.deFlex}>
                    <View style={styles.deFlex2}>
                        <MaterialIcons name="description" style={styles.Icon} size={20} color="#CB6CE6" />
                        <Text>Descripcion:</Text>
                    </View>
                    <View style={styles.deFlex2}>
                        <Text>{actividad?.descripcion}</Text>
                    </View>

                </View>
                <View style={styles.deFlex}>
                    <View style={styles.deFlex2}>
                        <MaterialIcons name="credit-card" size={20} color="#CB6CE6" style={styles.Icon} />
                        <Text>Tipo:</Text>
                    </View>
                    <View style={styles.deFlex2}>
                        <Text>{actividad?.tipo}</Text>
                    </View>
                </View>


                <View style={styles.deFlexButon}>
                    <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.7} style={styles.butonEdit}>
                        <Text style={styles.butonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleEliminar} activeOpacity={0.7} style={styles.butonDelet}>
                        <Text style={styles.butonText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal visible={modalVisible} animationType="slide" >
                <View style={styles.modalContainer}>
                    <LinearGradient colors={['#1FC2D7', '#CB6CE6',]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                        <View style={styles.headerAtras3} >
                            <TouchableOpacity style={styles.atras} onPress={() => setModalVisible(false)}>
                                <AntDesign name="arrowleft" size={24} color="#fff" />
                            </TouchableOpacity>

                        </View>
                    </LinearGradient>
                    <View style={styles.modalContent}>



                        <View style={styles.inputsFlex}>
                            <FontAwesome name="dollar" size={20} color='rgba(0, 0, 0, 0.3)' />
                            <TextInput
                                value={monto}
                                onChangeText={(value) => setMonto(value)}
                                placeholder="Monto"
                                keyboardType="numeric"
                                style={styles.inputEdit}
                            />
                        </View>
                        <View style={styles.inputsFlex}>
                            <MaterialIcons name="description" size={20} color='rgba(0, 0, 0, 0.3)' />

                            <TextInput
                                value={descripcion}
                                onChangeText={(value) => setDescripcion(value)}
                                placeholder="Descripción"
                                style={styles.inputEdit}
                            />
                        </View>


                        <View style={styles.deFlexButon}>
                            <TouchableOpacity
                                style={styles.buttonGuardar}
                                onPress={() => { setModalVisible(false); handleEditar(); }}
                            >
                                <Text style={styles.buttonGuCancelText}>Guardar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonCancelar}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonGuCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Dialog
                visible={showAlert}
                onTouchOutside={() => setShowAlert(false)}

            >
                <View style={styles.agregado}>
                    <Text>¡Actividad Editada!</Text>
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
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: '100%'
    },
    containerDetail: {
        padding: 20,

        backgroundColor: '#ffff',


    },
    headerAtras: {


        flexDirection: 'row',
        paddingTop: 60,
        padding: 20,
        justifyContent: 'space-between',
        height: 200
    },
    headerAtras3: {
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-between',

    },
    headerAtras2: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: 100,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        marginTop: -50,
        margin: 20,
        borderRadius: 8,
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
    },

    inputEdit: {
        width: '90%',
        marginLeft: 10
    },
    deFlex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 15,
        borderBottomWidth: 0.3,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        padding: 10
    },
    deFlex2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    deFlexButon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 80

    },
    butonEdit: {
        backgroundColor: '#1FC2D7',
        padding: 10,
        borderRadius: 20,
        width: 150,
        textAlign: 'center',
        justifyContent: 'center',
    },
    butonDelet: {
        backgroundColor: '#CB6CE6',
        padding: 10,
        borderRadius: 20,
        width: 150,
        textAlign: 'center',
        justifyContent: 'center',
    },
    butonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16
    },

    deFlexButon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20
    },
    buttonCancelar: {
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
    buttonGuCancelText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16
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
        padding: 10,
        marginTop: 10,
    },
    modalContent: {
        padding: 20
    },
    Icon: {
        backgroundColor: 'rgba(203, 108, 230, 0.1)',
        borderRadius: 8,
        padding: 4
    },
    agregado: {
        padding: 20,

    },
})