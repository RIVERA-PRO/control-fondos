import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Modal, TextInput, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
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

            <TextInput
                style={styles.inputBuscar}
                placeholder="Buscar..."
                value={filtroBusqueda}
                onChangeText={handleBuscar}
            />
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

            {actividades.length > 0 && (
                <TouchableOpacity
                    style={styles.button}
                    onPress={eliminarActividades}
                >
                    <Text style={styles.buttonText}>Eliminar actividades</Text>
                </TouchableOpacity>
            )}

            <Text>Actividad</Text>
            {filtrarActividades().map((actividad) => (
                <View key={actividad.id} style={styles.actividadContainer}>
                    <Text>{new Date(actividad.createdAt).toLocaleString()}</Text>
                    <Text>Categoría: {actividad.categoria}</Text>
                    <Text style={{ color: actividad.categoria === 'Ingreso' ? 'green' : 'red' }}>$ {actividad.monto}</Text>
                    <Text>Descripción: {actividad.descripcion}</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => eliminarActividad(actividad.id)}
                    >
                        <Text style={styles.buttonText}>Eliminar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => abrirModalEdicion(actividad.id, actividad.monto, actividad.descripcion)}
                    >
                        <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            verDetalle(actividad.id);
                        }}
                    >
                        <Text style={styles.buttonText}>Ver detalle</Text>
                    </TouchableOpacity>
                </View>
            ))}



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


        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer2: {
        flexGrow: 1,
        paddingTop: 100,
        backgroundColor: '#0000',

    },
    actividadContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
        backgroundColor: 'blue',
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
