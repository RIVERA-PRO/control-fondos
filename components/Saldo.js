import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Saldo() {
    const [actividades, setActividades] = useState([]);
    const [sumaIngresos, setSumaIngresos] = useState(0);
    const [sumaEgresos, setSumaEgresos] = useState(0);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        obtenerActividades();
    }, [reload]);

    const obtenerActividades = async () => {
        try {
            const actividadesGuardadas = await AsyncStorage.getItem('actividades');
            if (actividadesGuardadas !== null) {
                const parsedActividades = JSON.parse(actividadesGuardadas);
                setActividades(parsedActividades);
                calcularSumas(parsedActividades);
            }
        } catch (error) {
            console.log('Error al obtener las actividades del almacenamiento:', error);
        }
    };

    const calcularSumas = (actividades) => {
        let sumaIngresos = 0;
        let sumaEgresos = 0;
        actividades.forEach((actividad) => {
            if (actividad.categoria === 'Ingreso') {
                sumaIngresos += actividad.monto;
            } else if (actividad.categoria === 'Egreso') {
                sumaEgresos += actividad.monto;
            }
        });
        setSumaIngresos(sumaIngresos);
        setSumaEgresos(sumaEgresos);
    };

    const obtenerSaldoTotal = () => {
        const saldoTotal = sumaIngresos - sumaEgresos;
        return saldoTotal <= 0 ? 0 : saldoTotal;
    };

    const recargarComponente = () => {
        setReload(!reload);
    };

    return (
        <View style={styles.saldoContainer}>

            <View style={styles.containerSaldo}>

                <View style={styles.deFlex} >
                    <Text style={styles.total}>$ {obtenerSaldoTotal().toLocaleString()}</Text>
                    <TouchableOpacity onPress={recargarComponente} style={styles.button}>
                        <Icon name="refresh" size={20} color="#007AFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.deFlex2} >
                    <Text style={styles.sumaIngresos}>+ ${sumaIngresos.toLocaleString()}</Text>
                    <Text style={styles.sumaEgresos}>- ${sumaEgresos.toLocaleString()}</Text>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    saldoContainer: {
        height: 100,
        marginTop: 20,
        margin: 10,
        borderRadius: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 1,


    },
    containerSaldo: {
        flexDirection: 'column',
        gap: 20


    },
    button: {

        borderRadius: 20,
        padding: 10,
        marginRight: 10,
    },
    deFlex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    deFlex2: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    total: {
        fontSize: 23
    },
    sumaIngresos: {
        color: 'green'
    },
    sumaEgresos: {
        color: 'red'
    }

});
