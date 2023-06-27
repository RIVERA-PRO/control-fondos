import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Detail() {
    const route = useRoute();
    const { actividad } = route.params;
    const [monto, setMonto] = useState(actividad.monto.toString());
    const [descripcion, setDescripcion] = useState(actividad.descripcion);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const handleEditar = async () => {
        try {
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
                        };
                    }
                    return act;
                });

                // Guardar las actividades actualizadas en AsyncStorage
                await AsyncStorage.setItem('actividades', JSON.stringify(actividadesActualizadas));
            }
        } catch (error) {
            console.log('Error al editar la actividad:', error);
        }

        // Regresar a la pantalla anterior
        navigation.goBack();
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

    return (
        <View style={styles.container}>
            <Text>Categoría: {actividad?.categoria}</Text>
            <Text>Monto:</Text>
            <Text>{new Date(actividad.createdAt).toLocaleString()}</Text>
            <TextInput
                value={monto}
                onChangeText={(value) => setMonto(value)}
                keyboardType="numeric"
            />
            <Text>Descripción:</Text>
            <TextInput
                value={descripcion}
                onChangeText={(value) => setDescripcion(value)}
            />
            <Button title="Editar" onPress={() => setModalVisible(true)} />
            <Button title="Eliminar" onPress={handleEliminar} />

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Editar Actividad</Text>
                        <Text>Monto:</Text>
                        <TextInput
                            value={monto}
                            onChangeText={(value) => setMonto(value)}
                            keyboardType="numeric"
                        />
                        <Text>Descripción:</Text>
                        <TextInput
                            value={descripcion}
                            onChangeText={(value) => setDescripcion(value)}
                        />
                        <Button title="Guardar" onPress={() => { setModalVisible(false); handleEditar(); }} />
                        <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0080ff',
        paddingHorizontal: 10,
        flexDirection: 'column',
        padding: 20,

        paddingTop: 200,
        justifyContent: 'center',
        borderRadius: 16,
        width: '100%',
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 1,


    },
})
