import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Modal, TextInput, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
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
                setActividades(actividadesParseadas);
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

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer2}>

            {actividades.length > 0 ? (
                <View>
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

                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={eliminarActividades}
                    >
                        <Text style={styles.buttonText}>Eliminar actividades</Text>
                    </TouchableOpacity>


                    <View style={styles.containerActividad}>
                        {filtrarActividades().map((actividad) => (
                            <View>


                                <View style={styles.deFlex}>
                                    <TouchableOpacity
                                        style={styles.icson}
                                        onPress={() => {
                                            verDetalle(actividad.id);
                                        }}
                                    >

                                        <Text style={styles.detalle} > Ver Detalles</Text>


                                    </TouchableOpacity>
                                    <View style={styles.deFlex2}>
                                        <TouchableOpacity
                                            style={styles.iscon}
                                            onPress={() => eliminarActividad(actividad.id)}
                                        >
                                            <MaterialIcons name="delete" size={18} color="#F63E7B" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.iscon}
                                            onPress={() => abrirModalEdicion(actividad.id, actividad.monto, actividad.descripcion)}
                                        >
                                            <Feather name="edit" size={16} color="#022a9b" />
                                        </TouchableOpacity>
                                    </View>



                                </View>
                                <View key={actividad.id} style={styles.actividadContainer}>
                                    <MaterialCommunityIcons style={styles.icon} name="bank-transfer" size={24} color="black" />

                                    <View style={styles.deRow}>
                                        <Text style={styles.Date}>{new Date(actividad.createdAt).toLocaleString()}</Text>
                                        {actividad.descripcion.length > 16 ? (
                                            <Text style={styles.descripcion}>{actividad.descripcion.slice(0, 16)}..</Text>
                                        ) : (
                                            <Text style={styles.descripcion}>{actividad.descripcion}</Text>
                                        )}
                                    </View>
                                    <Text style={{ color: actividad?.categoria === 'Ingreso' ? 'green' : 'red' }}>
                                        {actividad.categoria === 'Egreso' && '- '}
                                        $ {actividad.monto.toLocaleString().slice(0, 13)}
                                    </Text>

                                </View>

                            </View>
                        ))}
                    </View>



                    <Modal
                        visible={editModalVisible}
                        animationType="slide"
                        onRequestClose={() => setEditModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <Text>Editar actividad</Text>
                            <TextInput
                                value={editMonto}
                                onChangeText={setEditMonto}
                                placeholder="Monto"
                                keyboardType="numeric"
                                style={styles.input}
                            />
                            <TextInput
                                value={editDescripcion}
                                onChangeText={setEditDescripcion}
                                placeholder="Descripción"
                                style={styles.input}
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => guardarEdicion()}
                            >
                                <Text style={styles.buttonText}>Guardar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>

            ) : (
                <TouchableOpacity
                    style={styles.button}

                >
                    <Text style={styles.buttonText}>Agregar actividades</Text>
                </TouchableOpacity>
            )}



        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer2: {
        flexGrow: 1,



    },
    containerActividad: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 20,

        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 1,
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
    filtros: {
        backgroundColor: '#022a9b',
        paddingTop: 80,
        width: '100%',
        gap: 20,
        justifyContent: 'center',

    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        marginBottom: 10,
        margin: 15,
        padding: 5
    },
    inputBuscar: {
        padding: 3,
        width: '90%',

    },
    searchIcon: {
        marginRight: 10,

    },
    actividadContainer: {
        borderBottomWidth: 0.3,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        padding: 5,
        marginBottom: 10,
        flexDirection: 'row',
        gap: 20,

    },

    deFlex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
    },
    deRow: {
        flexDirection: 'column',

    },

    icon: {
        backgroundColor: 'rgba(2, 42, 155, 0.2)',
        borderRadius: 8,
        padding: 4
    },
    Date: {
        fontSize: 12
    },
    deFlex2: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 20
    },

    detalle: {
        color: "#022a9b",
        fontSize: 13
    },
    pickerCategoria: {
        backgroundColor: '#fff',

    }


});
