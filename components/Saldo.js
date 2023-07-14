import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Grafica from './Grafica'
import Grafica2 from './Grafica2'
export default function Saldo() {
    const [actividades, setActividades] = useState([]);
    const [sumaIngresos, setSumaIngresos] = useState(0);
    const [sumaEgresos, setSumaEgresos] = useState(0);
    const [reload, setReload] = useState(false);
    const isFocused = useIsFocused();
    const [modalVisible, setModalVisible] = useState(false);
    const [tipoSuma, setTipoSuma] = useState(''); // Puede ser 'ingresos' o 'egresos'
    const [actividadesIngresos, setActividadesIngresos] = useState([]);
    const [actividadesEgresos, setActividadesEgresos] = useState([]);

    const abrirModal = (tipo) => {
        setTipoSuma(tipo);
        setModalVisible(true);
    };



    useEffect(() => {
        obtenerActividades();
    }, [reload, isFocused]);

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
        const actividadesIngresos = [];
        const actividadesEgresos = [];
        actividades.forEach((actividad) => {
            if (actividad.categoria === 'Ingreso') {
                sumaIngresos += actividad.monto;
                actividadesIngresos.push(actividad);
            } else if (actividad.categoria === 'Egreso') {
                sumaEgresos += actividad.monto;
                actividadesEgresos.push(actividad);
            }
        });
        setSumaIngresos(sumaIngresos);
        setSumaEgresos(sumaEgresos);
        setActividadesIngresos(actividadesIngresos);
        setActividadesEgresos(actividadesEgresos);
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
                {actividades.length === 0 ? (
                    <>
                        <View style={styles.deFlex}>
                            <Text style={styles.total}>
                                $ {obtenerSaldoTotal().toLocaleString()}
                            </Text>
                            <TouchableOpacity onPress={recargarComponente} style={styles.button}>
                                <Icon name="refresh" size={20} color="#CB6CE6" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.deFlex2}>
                            <TouchableOpacity
                                onPress={() => abrirModal('ingresos')}
                                style={styles.totalnumber}
                            >
                                <Entypo name="log-out" style={styles.icon2} size={11} color='#CB6CE6' />
                                <Text style={styles.sumaIngresos}>
                                    + ${sumaIngresos.toLocaleString()}
                                </Text>

                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => abrirModal('egresos')}
                                style={styles.totalnumber}
                            >
                                <Entypo name="log-out" style={styles.icon2} size={11} color='#CB6CE6' />
                                <Text style={styles.sumaEgresos}>
                                    - ${sumaEgresos.toLocaleString()}
                                </Text>

                            </TouchableOpacity>

                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.deFlex}>
                            <Text style={styles.total}>
                                $ {obtenerSaldoTotal().toLocaleString()}
                            </Text>
                            <TouchableOpacity onPress={recargarComponente} style={styles.button}>
                                <Icon name="refresh" size={20} color="#CB6CE6" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.deFlex2}>
                            <TouchableOpacity
                                onPress={() => abrirModal('ingresos')}
                                style={styles.totalnumber}
                            >

                                <Feather name="arrow-up-right" size={13} color='#CB6CE6' style={styles.icon2} />
                                <Text style={styles.sumaIngresos}>
                                    + ${sumaIngresos.toLocaleString()}
                                </Text>

                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => abrirModal('egresos')}
                                style={styles.totalnumber}
                            >
                                <Feather name="arrow-down-left" size={13} color='#CB6CE6' style={styles.icon2} />
                                <Text style={styles.sumaEgresos}>
                                    - ${sumaEgresos.toLocaleString()}
                                </Text>

                            </TouchableOpacity>

                        </View>
                    </>
                )}
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <ScrollView style={styles.modalbg}>
                    <View style={styles.modalContainer}>
                        <LinearGradient colors={['#1FC2D7', '#CB6CE6',]} style={styles.container} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}>
                            <View style={styles.headerAtras} >

                                <TouchableOpacity style={styles.atras} onPress={() => setModalVisible(false)}>
                                    <AntDesign name="arrowleft" size={24} color="#fff" />
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>
                                    {tipoSuma === 'ingresos' ? 'Total de Ingresos' : 'Total de Egresos'}
                                </Text>
                            </View>
                        </LinearGradient>

                        {tipoSuma === 'ingresos' && (
                            <View>
                                <View style={styles.headerAtras2} >
                                    <Text style={styles.sumaIngresosText}>
                                        ${sumaIngresos.toLocaleString()}
                                    </Text>

                                </View>
                                <View style={styles.graficaContain} >
                                    <Grafica />
                                </View>


                                {actividadesIngresos.map((actividad) => (
                                    <View style={styles.actividadContainer}>
                                        <View style={styles.deFlexActivity}>
                                            <Feather name="arrow-up-right" size={24} color='#CB6CE6' style={styles.icon2} />
                                            {actividad.descripcion.length > 20 ? (
                                                <Text style={styles.descripcion}>{actividad.descripcion.slice(0, 20)}..</Text>
                                            ) : (
                                                <Text style={styles.descripcion}>{actividad.descripcion}</Text>
                                            )}
                                        </View>
                                        <Text key={actividad.id} style={styles.sumaIngresos}>
                                            + ${actividad.monto.toLocaleString()}
                                        </Text>
                                    </View>
                                ))}
                                <View style={styles.totalResult}>

                                    <View style={styles.deFlex}>
                                        <FontAwesome name="dollar" size={20} color='#CB6CE6' style={styles.icon} />
                                        <Text style={styles.totalText}> Total </Text>
                                    </View>
                                    <Text style={styles.sumaIngresos}>
                                        ${sumaIngresos.toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                        )}
                        {tipoSuma === 'egresos' && (
                            <View>
                                <View style={styles.headerAtras2} >
                                    <Text style={styles.sumaEgresosText}>
                                        - ${sumaEgresos.toLocaleString()}
                                    </Text>
                                </View>

                                <View style={styles.graficaContain} >
                                    <Grafica2 />
                                </View>
                                {actividadesEgresos.map((actividad) => (
                                    <View style={styles.actividadContainer}>
                                        <View style={styles.deFlexActivity}>
                                            <Feather name="arrow-down-left" size={24} color='#CB6CE6' style={styles.icon2} />
                                            {actividad.descripcion.length > 20 ? (
                                                <Text style={styles.descripcion}>{actividad.descripcion.slice(0, 20)}..</Text>
                                            ) : (
                                                <Text style={styles.descripcion}>{actividad.descripcion}</Text>
                                            )}
                                        </View>
                                        <Text key={actividad.id} style={styles.sumaEgresos}>
                                            - ${actividad.monto.toLocaleString()}
                                        </Text>
                                    </View>

                                ))}
                                <View style={styles.totalResult}>
                                    <View style={styles.deFlex}>
                                        <FontAwesome name="dollar" size={20} color='#CB6CE6' style={styles.icon} />
                                        <Text style={styles.totalText}> Total </Text>
                                    </View>
                                    <Text style={styles.sumaEgresos}>
                                        ${sumaEgresos.toLocaleString()}
                                    </Text>
                                </View>

                            </View>

                        )}

                    </View>
                    <View style={styles.seccion}>

                        <Text style={styles.text}>

                        </Text>

                    </View>
                    <View style={styles.seccion}>

                        <Text style={styles.text}>

                        </Text>

                    </View>
                </ScrollView>

            </Modal>


        </View>
    );
}

const styles = StyleSheet.create({
    ScrollView: {

    },
    saldoContainer: {
        height: 110,
        marginTop: -50,
        margin: 15,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,


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
        alignItems: 'center',

    },
    deFlex2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,

    },
    total: {
        fontSize: 23,
        paddingLeft: 20,
        color: 'rgba(0, 0, 0, 0.6)',
        fontWeight: '600'
    },
    sumaIngresos: {
        color: 'green',

    },
    sumaEgresos: {
        color: 'red',

    },

    modalbg: {
        backgroundColor: '#fff',
        height: '100%',
    },
    headerAtras: {
        flexDirection: 'row',
        paddingTop: 40,
        padding: 20,
        justifyContent: 'space-between',
        height: 180
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
    modalTitle: {
        color: '#fff',
        fontWeight: 'bold'
    },
    actividadContainer: {
        borderBottomWidth: 0.3,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        padding: 5,
        marginBottom: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
        margin: 20
    },
    deFlexActivity: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20
    },
    icon: {

        backgroundColor: 'rgba(203, 108, 230, 0.1)',
        borderRadius: 4,
        padding: 4,
        width: 32,
        height: 32,
        textAlign: 'center',
        marginLeft: 4
    },
    totalResult: {
        margin: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalText: {
        fontWeight: '600',
        fontSize: 15,
        color: 'rgba(0, 0, 0, 0.8)',
        marginLeft: 15
    },
    sumaIngresosText: {
        fontSize: 20,
        color: 'green'
    },
    sumaEgresosText: {
        fontSize: 20,
        color: 'red'
    },
    icon2: {
        backgroundColor: 'rgba(203, 108, 230, 0.1)',

        borderRadius: 4,
        padding: 4
    },
    totalnumber: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,


    },
    graficaContain: {
        margin: 20
    }
});
