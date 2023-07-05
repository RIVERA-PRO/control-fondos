import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View, image, style, Platform } from 'react-native';
import Home from '../screens/Home'

import Detail from '../screens/Detail'
import Categorias from '../screens/Categorias'
import Perfil from '../screens/Perfil'
import Mas from '../screens/Mas'
import Actividades from '../screens/Actividades'
import NotasScreen from "../screens/NotasScreen";
import FormNotas from "../screens/FormNotas";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

function BottomTabsNavigation() {




    return (
        <Tab.Navigator
            tabBarOptions={{
                showLabel: false,
                style: {
                    position: 'absolute',
                    bottonm: 25,
                    left: 20,
                    right: 20,

                    borderRadius: 15,
                    height: 56,


                },
                labelStyle: {
                    fontSize: 11,
                    marginBottom: 3,
                },
                activeTintColor: '#1FC2D7',
                inactiveTintColor: 'rgba(0, 0, 0, 0.6)',


            }}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarStyle: {
                        backgroundColor: '#fff',
                        height: 53,
                        elevation: 0,
                        position: 'absolute',


                    },
                    activeTintColor: '#022a9b',
                    inactiveTintColor: '#9B9B9B',
                    headerShown: false,
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="home" size={24} color={color} />
                    ),
                }}
            />



            <Tab.Screen
                name="Mas"
                component={Mas}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <View
                            style={{
                                top: Platform.OS === "ios" ? -30 : -30,
                                width: Platform.OS === "ios" ? 50 : 60,
                                height: Platform.OS === "ios" ? 50 : 60,
                                borderRadius: Platform.OS === "ios" ? 25 : 30,
                                position: 'absolute',
                                bottom: 10,
                                backgroundColor: '#1FC2D7',
                                alignItems: 'center',
                                justifyContent: 'center',
                                shadowColor: '#1FC2D7',
                                shadowOffset: { width: 10, height: 20 },
                                shadowOpacity: 10.25,
                                shadowRadius: 300,
                                elevation: 7,
                            }}
                        >
                            <Feather name="plus" size={30} color="#fff" />
                        </View>
                    ),
                    tabBarStyle: {
                        backgroundColor: '#fff',
                        height: 53,
                        elevation: 0,
                        position: 'absolute',
                    },
                    activeTintColor: '#022a9b',
                    inactiveTintColor: '#9B9B9B',
                    headerShown: false,
                }}
            />


            < Tab.Screen name="Actividades"
                component={Actividades}
                options={{
                    tabBarStyle: {
                        backgroundColor: '#fff',
                        height: 53,
                        elevation: 0,
                        position: 'absolute',
                    },
                    activeTintColor: '#022a9b',
                    inactiveTintColor: '#9B9B9B',
                    headerShown: false,
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="bank-transfer" size={26} color={color} />
                    ),
                }} />

            < Tab.Screen name="NotasScreen"
                component={NotasScreen}
                options={{
                    tabBarStyle: {
                        backgroundColor: '#fff',
                        height: 53,
                        elevation: 0,
                        position: 'absolute',
                    },
                    activeTintColor: '#022a9b',
                    inactiveTintColor: '#9B9B9B',
                    headerShown: false,
                    tabBarLabel: 'NotasScreen',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="book" size={20} color={color} />
                    ),
                }} />
            < Tab.Screen name="FormNotas"
                component={FormNotas}
                options={{
                    tabBarButton: () => null, // Ocultar el botón del tab
                    tabBarStyle: {
                        backgroundColor: '#fff',
                        height: 53,
                        elevation: 0,
                        position: 'absolute',
                    },
                    activeTintColor: '#022a9b',
                    inactiveTintColor: '#9B9B9B',
                    headerShown: false,
                    tabBarLabel: 'FormNotas',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="book" size={20} color={color} />
                    ),
                }} />
            < Tab.Screen name="Detail" component={Detail}
                options={{
                    tabBarButton: () => null, // Ocultar el botón del tab
                    tabBarStyle: {
                        backgroundColor: '#fff',
                        height: 53,
                        elevation: 0,
                        position: 'absolute',
                    },
                    activeTintColor: '#022a9b',
                    inactiveTintColor: '#9B9B9B',
                    headerShown: false,
                    tabBarLabel: 'Details',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="info" size={24} color={color} />
                    ),
                }} />





        </Tab.Navigator >


    );
}

export default BottomTabsNavigation;
