import React, {useEffect} from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

import firebase from 'firebase'
import Styles from '../Styles'

const Loading = (props) => {

    // function to check user is logged in or not
    const checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged( (user) => {
            if (user) {
                props.navigation.navigate('TinterosScreen')
            } else {
                props.navigation.navigate('LoginScreen')
            }
        })
    }

    useEffect( () => {
        checkIfLoggedIn();
    }, [])


    return (
        <View>
            <ActivityIndicator
                style={Styles.loading}
                size='large'
            />
            <Text>
                Loading, please wait.
            </Text>
        </View>
    )
}

export default Loading
