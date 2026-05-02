import React, { useState } from 'react'
import { View, Text, Button, ScrollView, TextInput } from 'react-native'

import { auth } from '../components/firebase'
import Styles from '../Styles'

const Login = (props) => {

    const [userInfo, setUserInfo] = useState({
        email: '',
        password: ''
    })

    const handleTextChange = (name, value) => {
        setUserInfo({
            ...userInfo, [name]: value
        })
    }

    // login with credentials

    const loginUser = () => {
        console.log('USER INFO AFTER TRIGGERING LOGIN FUNC', userInfo)
        auth.signInWithEmailAndPassword(userInfo.email, userInfo.password)
        .then(
            console.log('logged in successfully, redirecting you'),
            props.navigation.navigate('TinterosScreen')
        )
        .catch( (error) => {
            console.log('something went wrong: error: ', error),
            props.navigation.navigate('LoginScreen')
        })
    }

    const goToRegister = () => {
        props.navigation.navigate('RegisterScreen')
    }

    return (
        <ScrollView 
            style={Styles.container}
        >
            <Text>
                Login to access your account
            </Text>

            <View
                style={Styles.inputGroup}
            >
                <Text>
                    Enter your email
                </Text>
                <TextInput
                    onChangeText={(value) => handleTextChange('email', value)}
                    placeholder='john@gmail.com'
                />
            </View>
            <View
                style={Styles.inputGroup}
            >
                <Text>
                    Enter your password
                </Text>
                <TextInput
                    onChangeText={(value) => handleTextChange('password', value)}
                    placeholder='password'
                />
            </View>
            <View
                style={Styles.inputGroup}
            >
                <Button
                    title='Login'
                    onPress={loginUser}
                />

            </View>

            {/* no account? go to register screen */}

            <View 
                style={Styles.inputGroup}>
                    <Button
                        title="Don't have an account?"
                        onPress={goToRegister}
                    />
            </View>

        </ScrollView>
    )
}

export default Login
