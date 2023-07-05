import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';
import { AntDesign } from '@expo/vector-icons';
export default function Actividad() {
    const isFocused = useIsFocused();
    const [actividades, setActividades] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        obtenerActividades();
    }, [isFocused]);

    const goToActividades = () => {
        navigation.navigate('Actividades');
    };

    const obtenerActividades = async () => {
        try {
            const actividadesGuardadas = await AsyncStorage.getItem('actividades');
            if (actividadesGuardadas) {
                const actividadesParseadas = JSON.parse(actividadesGuardadas);
                const actividadesInvertidas = actividadesParseadas.reverse(); // Invertir el orden de las actividades
                console.log(actividadesInvertidas);
                setActividades(actividadesInvertidas);
            }
        } catch (error) {
            console.log('Error al obtener las actividades:', error);
        }
    };

    const exportarActividades = async () => {
        try {
            // Obtener las actividades de AsyncStorage
            const actividades = await AsyncStorage.getItem('actividades');
            const parsedActividades = JSON.parse(actividades);

            // Calcular el total de ingresos y egresos
            let totalIngresos = 0;
            let totalEgresos = 0;
            parsedActividades.forEach(actividad => {
                if (actividad.categoria === 'Ingreso') {
                    totalIngresos += actividad.monto;
                } else if (actividad.categoria === 'Egreso') {
                    totalEgresos += actividad.monto;
                }
            });

            // Convertir las actividades a una matriz de objetos planos
            const actividadesArray = parsedActividades.map(actividad => ({
                Id: actividad.id,
                Categoria: actividad.categoria,
                Tipo: actividad.tipo,
                Monto: actividad.monto,
                Descripcion: actividad.descripcion,
                Fecha: actividad.createdAt
            }));

            // Calcular el total de ingresos
            const ingresosArray = parsedActividades.filter(actividad => actividad.categoria === 'Ingreso');
            const totalIngresos2 = ingresosArray.reduce((total, actividad) => total + actividad.monto, 0);

            // Calcular el total de egresos
            const egresosArray = parsedActividades.filter(actividad => actividad.categoria === 'Egreso');
            const totalEgresos3 = egresosArray.reduce((total, actividad) => total + actividad.monto, 0);

            // Agregar una fila adicional para el total de ingresos y egresos
            actividadesArray.push({
                Id: '', // Opcional: puedes dejar este campo en blanco
                Categoria: 'Total de ingresos',
                Tipo: '',
                Monto: totalIngresos2,
                Descripcion: '',
                Fecha: ''
            });
            actividadesArray.push({
                Id: '', // Opcional: puedes dejar este campo en blanco
                Categoria: 'Total de egresos',
                Tipo: '',
                Monto: totalEgresos3,
                Descripcion: '',
                Fecha: ''
            });

            // Crear la hoja de cálculo Excel
            const worksheet = XLSX.utils.aoa_to_sheet([
                Object.keys(actividadesArray[0]), // Encabezados de columna
                ...actividadesArray.map(actividad => Object.values(actividad)) // Valores de las actividades
            ]);

            // Crear el libro y adjuntar la hoja de cálculo
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Actividades');

            // Generar el archivo Excel
            const excelBuffer = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

            // Guardar el archivo Excel en el directorio de documentos del dispositivo
            const excelUri = FileSystem.documentDirectory + 'actividades.xlsx';
            await FileSystem.writeAsStringAsync(excelUri, excelBuffer, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Compartir la ubicación del archivo Excel
            await Sharing.shareAsync(excelUri);

            console.log('Archivo exportado y compartido:', excelUri);
        } catch (error) {
            console.log('Error al exportar el archivo:', error);
        }
    };

    const goToMas = () => {
        navigation.navigate('Mas');

    };

    if (actividades.length === 0) {
        return (
            <View style={styles.scrollContainerSinActividad}>
                <Text>No hay actividades</Text>
                <TouchableOpacity
                    style={styles.Agregar}
                    onPress={goToMas}
                >
                    <Text style={styles.buttosnText}>Agregar </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer2}>
            <View style={styles.deFlex}>
                <Text style={styles.Actividad}>Actividad</Text>

                <TouchableOpacity onPress={goToActividades} style={styles.verMas}>
                    <Text style={styles.verMasText}>Ver más</Text>

                </TouchableOpacity>

            </View>
            {actividades.slice(0, 6).map((actividad) => (
                <View key={actividad.id} style={styles.actividadContainer}>
                    <MaterialCommunityIcons style={styles.icon} name="bank-transfer" size={24} color='#CB6CE6' />

                    <View style={styles.deRow}>
                        <Text style={styles.Date}>{new Date(actividad.createdAt).toLocaleString()}</Text>
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
            ))}

        </ScrollView>
    );
}
const styles = StyleSheet.create({
    scrollContainerSinActividad: {
        flexGrow: 1,
        paddingTop: 10,
        height: 375,
        justifyContent: 'center',
        alignItems: 'center'


    },
    scrollContainer2: {
        flexGrow: 1,
        paddingTop: 10,


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
        backgroundColor: 'rgba(31, 194, 215, 0.1)',
        backgroundColor: 'rgba(203, 108, 230, 0.1)',
        borderRadius: 8,
        padding: 4
    },
    descripcion: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.6)',
        fontWeight: '600'
    },
    Date: {
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 13
    },
    monto: {
        marginLeft: 20
    },
    Actividad: {
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
    verMasicon: {
        marginTop: 2
    },
    Agregar: {
        backgroundColor: '#022a9b',
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
    }

});
