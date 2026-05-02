import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import Header from './components/Header'
import Loading from './screens/Loading'
import Login from './screens/Login';
import NewTintero from './screens/NewTintero';
import Register from './screens/Register';
import Tinteros from './screens/Tinteros';
import User from './screens/User';
import Tintero from './screens/Tintero'


export default function App() {
  return (
    <>
    <Header/>
    <AppNavigator/>
    
    </>
  );
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: Loading,
  RegisterScreen: Register,
  TinterosScreen: Tinteros,
  LoginScreen: Login,
  UserScreen: User,
  CreateNewTinteroScreen: NewTintero,
  ThisTintero: Tintero
})

const AppNavigator = createAppContainer(AppSwitchNavigator)


