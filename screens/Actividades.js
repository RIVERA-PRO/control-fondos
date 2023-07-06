import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'
import { Octicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import filtro from '../assets/filtro.png'
import ExportarButon from '../components/ExportarButon';
import { LinearGradient } from 'expo-linear-gradient';
export default function Actividades() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [actividades, setActividades] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editMonto, setEditMonto] = useState('');
    const [editDescripcion, setEditDescripcion] = useState('');
    const [editActividadId, setEditActividadId] = useState('');
    const [filtroBusqueda, setFiltroBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const categorias = ['Ingreso', 'Egreso'];
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState(["Ingreso", "Egreso"]);

    const [mostrarFiltro, setMostrarFiltro] = useState(false);


    useEffect(() => {
        if (isFocused) {
            obtenerActividades();
        }
    }, [isFocused]);

    const obtenerActividades = async () => {
        try {
            const actividadesGuardadas = await AsyncStorage.getItem('actividades');
            if (actividadesGuardadas) {
                const actividadesParseadas = JSON.parse(actividadesGuardadas);
                const actividadesInvertidas = actividadesParseadas.reverse(); // Invertir el orden de las actividades
                // console.log(actividadesInvertidas);
                setActividades(actividadesInvertidas);
            }
        } catch (error) {
            console.log('Error al obtener las actividades:', error);
        }
    };


    const verDetalle = (id) => {
        const actividadSeleccionada = actividades.find((actividad) => actividad.id === id);
        if (actividadSeleccionada) {
            navigation.navigate('Detail', { actividad: actividadSeleccionada });
        }
    };
    const eliminarActividades = async () => {
        try {
            await AsyncStorage.removeItem('actividades');
            setActividades([]);
        } catch (error) {
            console.log('Error al eliminar las actividades:', error);
        }
    };
    const eliminarActividad = async (id) => {
        try {
            const actividadesGuardadas = await AsyncStorage.getItem('actividades');
            if (actividadesGuardadas) {
                const actividadesParseadas = JSON.parse(actividadesGuardadas);
                const nuevasActividades = actividadesParseadas.filter(
                    (actividad) => actividad.id !== id
                );
                await AsyncStorage.setItem(
                    'actividades',
                    JSON.stringify(nuevasActividades)
                );
                setActividades(nuevasActividades);
            }
        } catch (error) {
            console.log('Error al eliminar la actividad:', error);
        }
    };
    const abrirModalEdicion = (id, monto, descripcion) => {
        setEditModalVisible(true);
        setEditMonto(monto.toString());
        setEditDescripcion(descripcion);
        setEditActividadId(id);
    };

    const guardarEdicion = async () => {
        try {
            const actividadesGuardadas = await AsyncStorage.getItem('actividades');
            if (actividadesGuardadas) {
                const actividadesParseadas = JSON.parse(actividadesGuardadas);
                const nuevasActividades = actividadesParseadas.map((actividad) => {
                    if (actividad.id === editActividadId) {
                        return {
                            ...actividad,
                            monto: editMonto,
                            descripcion: editDescripcion,
                        };
                    }
                    return actividad;
                });
                await AsyncStorage.setItem(
                    'actividades',
                    JSON.stringify(nuevasActividades)
                );
                setActividades(nuevasActividades);
                setEditModalVisible(false);
            }
        } catch (error) {
            console.log('Error al guardar la edición:', error);
        }
    };
    const toggleCategorias = (categoria) => {
        if (categoriasSeleccionadas.includes(categoria)) {
            setCategoriasSeleccionadas(categoriasSeleccionadas.filter((c) => c !== categoria));
        } else {
            setCategoriasSeleccionadas([...categoriasSeleccionadas, categoria]);
        }
    };

    const filtrarPorCategoria = () => {
        if (categoriasSeleccionadas.length === 0) {
            return actividades; // Mostrar todas las actividades si no se selecciona ninguna categoría
        } else {
            const actividadesFiltradas = actividades.filter((actividad) => {
                return categoriasSeleccionadas.includes(actividad.categoria);
            });
            return actividadesFiltradas;
        }
    };

    const handleCategoriaSeleccionada = (categoria) => {
        const categoriasActualizadas = [...categoriasSeleccionadas];
        if (categoriasActualizadas.includes(categoria)) {
            const indiceCategoria = categoriasActualizadas.indexOf(categoria);
            categoriasActualizadas.splice(indiceCategoria, 1);
        } else {
            categoriasActualizadas.push(categoria);
        }
        setCategoriasSeleccionadas(categoriasActualizadas);
    };



    const filtrarActividades = () => {
        let actividadesFiltradas = actividades; // Obtener todas las actividades

        // Aplicar filtro de categoría
        if (filtroCategoria !== '') {
            actividadesFiltradas = actividadesFiltradas.filter(
                (actividad) => actividad.categoria === filtroCategoria
            );
        }

        // Aplicar filtro de búsqueda
        if (filtroBusqueda !== '') {
            actividadesFiltradas = actividadesFiltradas.filter((actividad) =>
                actividad.descripcion.toLowerCase().includes(filtroBusqueda.toLowerCase())
            );
        }

        return actividadesFiltradas;
    };

    const handleCategoriaChange = (categoria) => {
        setFiltroCategoria(categoria);
    };

    const handleBuscar = (texto) => {
        setFiltroBusqueda(texto);
    };
    const goToHome = () => {
        navigation.navigate('Home');

    };
    const goToMas = () => {
        navigation.navigate('Mas');

    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer2}>

            {actividades.length > 0 ? (
                <View>
                    <LinearGradient colors={['#1FC2D7', '#CB6CE6',]} style={styles.container} start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}>
                        <View style={styles.headerAtras} >
                            <TouchableOpacity style={styles.atras} onPress={goToHome}>
                                <AntDesign name="arrowleft" size={24} color="#fff" />
                            </TouchableOpacity>

                        </View>

                        <View style={styles.filtros}>

                            <View style={styles.searchInputContainer}>
                                <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
                                <TextInput
                                    style={styles.inputBuscar}
                                    placeholder="Buscar..."
                                    value={filtroBusqueda}
                                    onChangeText={handleBuscar}
                                />
                            </View>
                            <TouchableOpacity style={styles.buttonFiltro} onPress={() => setMostrarFiltro(!mostrarFiltro)}>
                                {/* <Octicons name="filter" size={24} color="#fff" /> */}
                                <Image source={filtro} style={styles.imgFiltro} />
                            </TouchableOpacity>
                        </View>
                        {mostrarFiltro && (
                            <View style={styles.filtroCategoriaContainer}>
                                <Picker
                                    selectedValue={filtroCategoria}
                                    onValueChange={handleCategoriaChange}
                                    style={styles.pickerCategoria}
                                >
                                    <Picker.Item label="Categorías" value="" />
                                    <Picker.Item label="Ingreso" value="Ingreso" />
                                    <Picker.Item label="Egreso" value="Egreso" />
                                </Picker>
                            </View>
                        )}
                    </LinearGradient>
                    <View style={styles.deFlexActividades}>
                        <ExportarButon />
                        <Text style={styles.buttonLength}>{actividades.length}</Text>
                        <TouchableOpacity
                            style={styles.iconDeleteAll}
                            onPress={eliminarActividades}
                        >
                            <Text style={styles.Text}>Borrar</Text>
                            <MaterialIcons name="delete" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>




                    <ScrollView style={styles.containerActividad}>
                        {filtrarActividades().length > 0 ? (
                            filtrarActividades().map((actividad) => (
                                <View key={actividad.id}>
                                    <View style={styles.deFlex}>
                                        {/* <TouchableOpacity
                                            style={styles.icson}
                                            onPress={() => {
                                                verDetalle(actividad.id);
                                            }}
                                        >
                                            <Text style={styles.detalle}>Ver Detalles</Text>
                                        </TouchableOpacity> */}
                                        {/* <View style={styles.deFlex2}>
                                            <TouchableOpacity
                                                style={styles.iscon}
                                                onPress={() =>
                                                    abrirModalEdicion(actividad.id, actividad.monto, actividad.descripcion)
                                                }
                                            >
                                                <Feather name="edit" size={16} color="#1FC2D7" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.iscon}
                                                onPress={() => eliminarActividad(actividad.id)}
                                            >
                                                <MaterialIcons name="delete" size={18} color="#CB6CE6" />
                                            </TouchableOpacity>
                                        </View> */}
                                    </View>

                                    <TouchableOpacity
                                        style={styles.icson}
                                        onPress={() => {
                                            verDetalle(actividad.id);
                                        }}
                                    >


                                        <View style={styles.actividadContainer}>
                                            <MaterialCommunityIcons
                                                style={styles.icon}
                                                name="bank-transfer"
                                                size={24}
                                                color='#CB6CE6'
                                            />
                                            <View style={styles.deRow}>
                                                <Text style={styles.Date}>
                                                    {new Date(actividad.createdAt).toLocaleString()}
                                                </Text>
                                                {actividad.descripcion.length > 16 ? (
                                                    <Text style={styles.descripcion}>{actividad.descripcion.slice(0, 16)}..</Text>
                                                ) : (
                                                    <Text style={styles.descripcion}>{actividad.descripcion}</Text>
                                                )}
                                            </View>
                                            <View style={styles.monto}>
                                                <Text style={{ color: actividad?.categoria === 'Ingreso' ? 'green' : 'red' }}>
                                                    {actividad.categoria === 'Egreso'}
                                                    $ {actividad.monto.toLocaleString().slice(0, 14)}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            ))
                        ) : (
                            <View style={styles.noResultContainer}>
                                <Text style={styles.noResultText}>No hay resultados</Text>

                            </View>
                        )}
                    </ScrollView>

                    <Modal
                        visible={editModalVisible}
                        animationType="slide"
                        onRequestClose={() => setEditModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <LinearGradient colors={['#1FC2D7', '#CB6CE6',]} style={styles.container} start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}>
                                <View style={styles.headerAtras2} >
                                    <TouchableOpacity style={styles.atras} onPress={() => setEditModalVisible(false)}>
                                        <AntDesign name="arrowleft" size={24} color="#fff" />
                                    </TouchableOpacity>
                                    <Text style={styles.EditarText}>Editar actividad</Text>

                                </View>
                            </LinearGradient>
                            <View style={styles.inputsEdit}>
                                <View style={styles.inputsFlex}>
                                    <FontAwesome name="dollar" size={20} color='rgba(0, 0, 0, 0.3)' style={styles.Icon} />
                                    <TextInput
                                        value={editMonto}
                                        onChangeText={setEditMonto}
                                        placeholder="Monto"
                                        keyboardType="numeric"
                                        style={styles.inputEdit}
                                    />
                                </View>
                                <View style={styles.inputsFlex}>
                                    <MaterialIcons name="description" size={20} color='rgba(0, 0, 0, 0.3)' style={styles.Icon} />

                                    <TextInput
                                        value={editDescripcion}
                                        onChangeText={setEditDescripcion}
                                        placeholder="Descripción"
                                        style={styles.inputEdit}
                                    />
                                </View>

                            </View>
                            <View style={styles.deFlexButon}>
                                <TouchableOpacity
                                    style={styles.buttonGuardar}
                                    onPress={() => guardarEdicion()}
                                >
                                    <Text style={styles.buttonGuCancelText}>Guardar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.buttonCancelar}
                                    onPress={() => setEditModalVisible(false)}
                                >
                                    <Text style={styles.buttonGuCancelText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                </View>

            ) : (
                <View>
                    <View style={styles.headerAtras} >
                        <TouchableOpacity style={styles.atras} onPress={goToHome}>
                            <AntDesign name="arrowleft" size={24} color="#fff" />
                        </TouchableOpacity>

                    </View>
                    <View style={styles.noHay}>
                        <Text style={styles.noHayText}>No Hay Actividades</Text>
                        <TouchableOpacity
                            style={styles.Agregar}
                            onPress={goToMas}
                        >
                            <Text style={styles.buttosnText}>Agregar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}



        </ScrollView>
    );
}

const styles = StyleSheet.create({

    buttonFiltro: {
        backgroundColor: '#fff',


    },
    buttonFiltro: {

    },
    scrollContainer2: {
        flexGrow: 1,
        backgroundColor: '#fff',

    },
    containerActividad: {
        padding: 15,
    },
    actividadContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
    },
    button: {
        marginTop: 10,

        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#022a9b',
        fontSize: 16,
        fontWeight: 'bold',
    },

    headerAtras: {

        flexDirection: 'row',
        paddingTop: 60,
        padding: 20,
        justifyContent: 'space-between',

    },
    headerAtras2: {

        flexDirection: 'row',
        paddingTop: 30,
        padding: 20,
        justifyContent: 'space-between',
    },
    filtros: {
        flexDirection: 'row',

        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,

        height: 180,
        marginTop: -20

    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        marginBottom: 10,
        padding: 3,
        width: '80%',
    },
    inputBuscar: {
        padding: 2,
        width: '90%',

    },
    noResultContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchIcon: {
        marginRight: 10,

    },
    actividadContainer: {
        borderBottomWidth: 0.3,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        padding: 5,
        marginBottom: 10,
        flexDirection: 'row',
        gap: 20,
        paddingLeft: 10,
        paddingRight: 10
    },
    imgFiltro: {
        width: 25,
        height: 25,
        marginTop: -8
    },

    deFlex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10
    },
    deRow: {
        flexDirection: 'column',

    },

    icon: {
        backgroundColor: 'rgba(2, 42, 155, 0.2)',
        backgroundColor: 'rgba(31, 194, 215, 0.2)',
        backgroundColor: 'rgba(203, 108, 230, 0.1)',
        borderRadius: 8,
        padding: 4,

    },
    Date: {
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 13
    },
    monto: {
        marginLeft: 40
    },
    descripcion: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.6)',
        fontWeight: '600'
    },
    deFlex2: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 20
    },

    detalle: {
        color: 'rgba(0, 0, 0, 0.8)',
        fontSize: 13
    },

    Agregar: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 200

    },
    deFlexActividades: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 30,
        marginTop: -25,
        backgroundColor: '#fff',
        paddingTop: 30
    },
    buttonLength: {
        color: "#FFF",
        backgroundColor: '#1FC2D7',
        borderRadius: 100,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        width: 40,
        height: 40,

    },
    deFlexButon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 25
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

    inputEdit: {

        paddingHorizontal: 10,
        width: '90%'
    },
    inputsEdit: {
        paddingTop: 100,
        padding: 20
    },
    EditarText: {
        color: '#fff'
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
    filtroCategoriaContainer: {

        justifyContent: 'center',

    },
    pickerCategoria: {
        color: '#fff',
        marginBottom: 30,

    },
    iconDeleteAll: {
        backgroundColor: '#CB6CE6',
        borderRadius: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
        padding: 5,
        gap: 5
    },
    Text: {
        color: '#fff'
    },
    Agregar: {
        backgroundColor: '#1FC2D7',
        borderRadius: 100,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: 110,
        padding: 4,
        gap: 5,
        marginTop: 20
    },
    buttosnText: {
        color: '#fff'
    },
    noHay: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 200
    }





});
