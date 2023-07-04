import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';

export default function ExportarButon() {
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
                console.log(actividadesGuardadas)
                setActividades(actividadesParseadas);
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



    if (actividades.length === 0) {
        return (
            <View style={styles.scrollContainer2}>
                <Text>No hay actividades</Text>
            </View>
        );
    }



    if (actividades.length === 0) {
        return (
            <View style={styles.scrollContainer2}>
                <Text>No hay actividades</Text>
            </View>
        );
    }

    return (
        <View contentContainerStyle={styles.scrollexportarButon}>


            <TouchableOpacity style={styles.exportarButon} onPress={exportarActividades}>

                <MaterialCommunityIcons name="file-excel" size={16} color="#fff" />
            </TouchableOpacity>


        </View>
    );
}
const styles = StyleSheet.create({
    scrollexportarButon: {
        backgroundColor: 'gren',
    },
    exportarButon: {
        backgroundColor: 'green',
        width: 40,
        height: 40,
        borderRadius: 100,
        padding: 4,
        gap: 5,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    exportarText: {
        color: '#fff'
    }

});
