import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, Text, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import HomeComponent from '../components/HomeComponent';
import Actividad from '../components/Actividad';
import Saldo from '../components/Saldo';
import { AntDesign } from '@expo/vector-icons';
import NotasHome from '../components/NotasHome';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
export default function PoliticaPrivacidad() {

    const openLinkedInProfile = () => {
        const linkedInURL = 'https://www.linkedin.com/in/juan-rivera-9ba866215/'; // Reemplaza con tu URL de LinkedIn
        Linking.openURL(linkedInURL);
    };

    const openWebsite = () => {
        const websiteURL = 'https://www.juan-rivera-developer.com/'; // Reemplaza con tu URL del sitio web
        Linking.openURL(websiteURL);
    };

    const openWhatsAppChat = () => {
        const phoneNumber = '1234567890'; // Reemplaza con tu número de teléfono
        const whatsappURL = `https://wa.me/qr/AHQDYWM7EKATH1`;
        Linking.openURL(whatsappURL);
    };

    return (
        <View>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.deFlex}>
                    <MaterialIcons name="privacy-tip" size={20} color='#CB6CE6' />
                    <Text style={styles.title} >
                        Política de Privacidad
                    </Text>
                </View>
                <View style={styles.seccion}>
                    <View style={styles.deFlex}>
                        <MaterialIcons name="privacy-tip" size={18} color='#CB6CE6' />
                        <Text style={styles.titleText}>
                            Última actualización: 6/7/2023
                        </Text>
                    </View>

                    <Text style={styles.text}>
                        Gracias por utilizar nuestra aplicación de control de fondos. En Money Minder, nos comprometemos a proteger la privacidad de nuestros usuarios y garantizar la seguridad de la información personal y financiera proporcionada. Esta política de privacidad describe cómo recopilamos, utilizamos y protegemos los datos ingresados por los usuarios en nuestra aplicación.
                    </Text>
                </View>


                <View style={styles.seccion}>
                    <View style={styles.deFlex}>
                        <MaterialIcons name="privacy-tip" size={18} color='#CB6CE6' />
                        <Text style={styles.titleText}>
                            Información recopilada:
                        </Text>
                    </View>
                    <Text style={styles.text}>

                        La aplicación  Money Minder solo recopila los datos ingresados por los usuarios, como transacciones, categorías y otra información financiera relevante. No recopilamos información personal identificable ni datos de ubicación.
                    </Text>
                </View>

                <View style={styles.seccion}>

                    <View style={styles.deFlex}>
                        <MaterialIcons name="privacy-tip" size={18} color='#CB6CE6' />
                        <Text style={styles.titleText}>
                            Uso de la información:
                        </Text>
                    </View>

                    <Text style={styles.text}>
                        Los datos ingresados por los usuarios se utilizan exclusivamente para brindar funcionalidad de control de fondos y generar informes financieros dentro de la aplicación. No compartimos, vendemos ni transmitimos estos datos a terceros. La aplicación no utiliza los datos con fines publicitarios.
                    </Text>

                </View>

                <View style={styles.seccion}>
                    <View style={styles.deFlex}>
                        <MaterialIcons name="privacy-tip" size={18} color='#CB6CE6' />
                        <Text style={styles.titleText}>
                            Almacenamiento de datos:
                        </Text>
                    </View>

                    <Text style={styles.text}>
                        Los datos ingresados por los usuarios se almacenan localmente en el dispositivo del usuario. La aplicación no accede ni guarda los datos en ningún servidor externo o en la nube. Nosotros no tenemos acceso a los datos personales o financieros almacenados en la aplicación.
                    </Text>

                </View>

                <View style={styles.seccion}>
                    <View style={styles.deFlex}>
                        <MaterialIcons name="privacy-tip" size={18} color='#CB6CE6' />
                        <Text style={styles.titleText}>
                            Exportación de datos:
                        </Text>
                    </View>

                    <Text style={styles.text}>
                        La aplicación  Money Minder permite a los usuarios exportar sus datos ingresados en un formato de archivo Excel para respaldo o análisis personal. Sin embargo, la responsabilidad de mantener y proteger estos archivos exportados recae en el usuario.
                    </Text>

                </View>
                <View style={styles.seccion}>
                    <View style={styles.deFlex}>
                        <MaterialIcons name="privacy-tip" size={18} color='#CB6CE6' />
                        <Text style={styles.titleText}>
                            Retención de datos:
                        </Text>
                    </View>

                    <Text style={styles.text}>
                        La aplicación  Money Minder no retiene los datos ingresados por los usuarios después de que se cierra o desinstala la aplicación, excepto por los archivos exportados por el usuario. No realizamos copias de seguridad ni almacenamos los datos ingresados por los usuarios en ningún otro lugar.
                    </Text>

                </View>

                <View style={styles.seccion}>

                    <View style={styles.deFlex}>
                        <MaterialIcons name="privacy-tip" size={18} color='#CB6CE6' />
                        <Text style={styles.titleText}>
                            Derechos del usuario:
                        </Text>
                    </View>

                    <Text style={styles.text}>
                        Los usuarios tienen el derecho de acceder, modificar, eliminar o exportar sus propios datos ingresados en la aplicación. Pueden realizar estas acciones directamente dentro de la aplicación.
                    </Text>

                </View>
                <View style={styles.seccion}>

                    <View style={styles.deFlex}>
                        <MaterialIcons name="privacy-tip" size={18} color='#CB6CE6' />
                        <Text style={styles.titleText}>
                            Cambios en la política de privacidad:
                        </Text>
                    </View>

                    <Text style={styles.text}>
                        Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Las modificaciones se publicarán en esta seccion y se indicará la fecha de actualización. Recomendamos a los usuarios revisar periódicamente esta política para estar informados sobre cómo protegemos la privacidad de sus datos.
                    </Text>



                </View>

                <View style={styles.seccion}>

                    <Text style={styles.text}>
                        Si tienes alguna pregunta o inquietud sobre nuestra política de privacidad, por favor contáctanos a través de:
                    </Text>

                </View>


                <View style={styles.social}>
                    <TouchableOpacity onPress={openLinkedInProfile} style={styles.btnNav}>
                        <FontAwesome name="linkedin" size={20} color="#CB6CE6" />

                    </TouchableOpacity>
                    <TouchableOpacity onPress={openWebsite} style={styles.btnNav}>
                        <FontAwesome name="globe" size={20} color="#CB6CE6" />

                    </TouchableOpacity>
                    <TouchableOpacity onPress={openWhatsAppChat} style={styles.btnNav}>
                        <FontAwesome name="whatsapp" size={20} color="#CB6CE6" />

                    </TouchableOpacity>
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
        </View>
    )
}

const styles = StyleSheet.create({

    scrollContainer: {
        padding: 20,
        paddingTop: 160,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgba(0, 0, 0, 0.7)',

    },
    seccion: {
        marginTop: 20
    },
    deFlex: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    titleText: {
        fontWeight: 'bold',
        color: 'rgba(0, 0, 0, 0.7)',
    },
    text: {
        fontSize: 13,
        color: 'rgba(0, 0, 0, 0.7)',
        paddingTop: 5
    },
    social: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',

    },
    btnNav: {
        flexDirection: 'row',
        gap: 10,
        borderRadius: 8,
        padding: 10,
        margin: 9,
        borderBottomWidth: 0.3,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
})