import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Modal, } from 'react-native';
import logo from '../assets/logo.png';
import { useNavigation } from '@react-navigation/native';
import image from '../assets/Cloud.png'
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
export default function Header() {

    const [isModalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [greeting, setGreeting] = useState('');
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const navigation = useNavigation();

    const goToHome = () => {
        navigation.navigate('Home');
        setModalVisible(!isModalVisible);
    };

    const goToProfile = () => {
        navigation.navigate('Perfil');
        setModalVisible(!isModalVisible);
    };

    const goToTime = () => {
        navigation.navigate('Time');
        setModalVisible(!isModalVisible);
    };
    const goToEjercicios = () => {
        navigation.navigate('Ejercicios');
        setModalVisible(!isModalVisible);
    };
    const goToCategorias = () => {
        navigation.navigate('Categorias');
        setModalVisible(!isModalVisible);
    };

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

    const handleRemoveName = async () => {
        try {
            await AsyncStorage.removeItem('Actividades');
            console.log('Name removed successfully');
            setName('');
        } catch (error) {
            console.error('Error removing name:', error);
        }
    };
    useEffect(() => {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();

        if (currentHour >= 6 && currentHour < 12) {
            setGreeting('Buenos días');
        } else if (currentHour >= 12 && currentHour < 20) {
            setGreeting('Buenas tardes');
        } else {
            setGreeting('Buenas noches');
        }
    }, []);
    return (

        <View style={styles.container}>
            <TouchableOpacity onPress={toggleModal}>
                <View style={styles.logoContainer} >
                    <View style={styles.logoContainer} >
                        <Image source={logo} style={styles.logo} />
                        <Text style={styles.logoText}>{greeting}</Text>
                    </View>
                    <EvilIcons name="navicon" size={24} color="#ffff" />
                </View>
            </TouchableOpacity>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={toggleModal}
                presentationStyle="overFullScreen"
                from="left"
            >

                <View style={styles.modalContainer} onPress={toggleModal}>
                    <View style={styles.modalContent} >

                        <Image source={image} style={styles.img} />
                        <View style={styles.navBtns}>
                            <TouchableOpacity onPress={goToHome} style={styles.btnNav}>
                                <FontAwesome name="home" size={20} color='#000' />
                                <Text style={styles.buttonText}>Home</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={goToTime} style={styles.btnNav}>
                                <MaterialCommunityIcons name="timer" size={20} color='#000' />
                                <Text style={styles.buttonText}>Rutinas</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={goToProfile} style={styles.btnNav}>
                                <MaterialIcons name="favorite" size={20} color='#000' />
                                <Text style={styles.buttonText}>Favoritos</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={goToEjercicios} style={styles.btnNav}>
                                <MaterialIcons name="fitness-center" size={20} color='#000' />
                                <Text style={styles.buttonText}>Ejercicios</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={goToCategorias} style={styles.btnNav}>
                                <MaterialIcons name="fitness-center" size={20} color='#000' />
                                <Text style={styles.buttonText}>Categorias</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toggleModal} style={styles.btnNav}>
                                <MaterialIcons name="logout" size={24} color="black" />
                                <Text style={styles.buttonText}>Cerrar</Text>
                            </TouchableOpacity>

                            <Text style={styles.text}>Contacto del desarrollador</Text>
                            <View style={styles.social}>
                                <TouchableOpacity onPress={openLinkedInProfile} style={styles.btnNav}>
                                    <FontAwesome name="linkedin" size={20} color="#000" />

                                </TouchableOpacity>
                                <TouchableOpacity onPress={openWebsite} style={styles.btnNav}>
                                    <FontAwesome name="globe" size={20} color="#000" />

                                </TouchableOpacity>
                                <TouchableOpacity onPress={openWhatsAppChat} style={styles.btnNav}>
                                    <FontAwesome name="whatsapp" size={20} color="#000" />

                                </TouchableOpacity>
                            </View>
                        </View>


                    </View>
                </View>
            </Modal>
        </View>

    );
}

const getCurrentDate = () => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#022a9b',
        paddingHorizontal: 10,
        flexDirection: 'column',
        padding: 20,
        height: 120,
        paddingTop: 40,
        justifyContent: 'center',
        borderRadius: 16,
        width: '100%',
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 1,


    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5,
        padding: 2,
    },
    logo: {
        width: 23,
        height: 23,


    },
    logoText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
    button: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        width: '80%',
        height: '100%',

    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    img: {
        width: '100%',
        height: 140,
        objectFit: 'cover'
    },
    navBtns: {
        marginTop: 30
    },

    btnNav: {
        flexDirection: 'row',
        gap: 10,
        borderRadius: 8,
        padding: 10,
        margin: 9,
    },
    social: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',

    },
    text: {
        textAlign: 'center',
        marginTop: 100
    }
});
