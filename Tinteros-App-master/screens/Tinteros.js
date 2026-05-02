import React, {useState, useEffect} from 'react'
import { View, Text, Button, ScrollView, ActivityIndicator } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import { log } from 'react-native-reanimated'

import db, { auth } from '../components/firebase'
import Styles from '../Styles'

const Tinteros = (props) => {

    const [tinteros, setTinteros] = useState([])
    const [resources, setResources] = useState({
        photoUrl: ''
    })

    useEffect( () => {
        // retrieve user tinteros
        const currentUser = auth.currentUser
        console.log(currentUser)
        const userId = currentUser.uid
        const usersRef = db.collection('tinteroUsers')

        // retrieve userData with userId
        const userData = async () => {
            try {
                const doc = await usersRef.doc(userId).get()
                const userData = doc.data()
                const userPhoto = userData.photoUrl
                setResources({...resources, photoUrl: userPhoto})
                console.log('user data: ', userData)
                setTinteros(userData.tinteros)
                
            }
            catch(error) {
                console.log('there was an error getting user info: ', error)
            }
        }
        userData()
    }, [])

    const logoutUser = () => {
        auth.signOut()
        .then( 
            console.log('user signed out'),
            props.navigation.navigate('LoginScreen')
        )
        .catch( (error) => {
            console.log('there was an error logging out: ', error)
        })
    }

    const goToNewTintero = () => {
        props.navigation.navigate('CreateNewTinteroScreen')
    }

    const goToTintero = () => {
        props.navigation.navigate('ThisTintero')
    }

    return (
        <ScrollView style={Styles.container}>
            {
               tinteros && tinteros.length ?
                
                    tinteros.map((tintero, i) => {
                       
                        return (
                            <ListItem
                                key={i}
                                onPress={goToTintero}
                                bottomDivider
                                
                            >
                                <Avatar source={resources.photoUrl}/>
                                <ListItem.Chevron/>
                                <ListItem.Content
                                    onPress={goToTintero}
                                    >
                                    <ListItem.Title>
                                        {tintero.name}
                                    </ListItem.Title>
                                    <ListItem.Subtitle>
                                        {tintero.with}
                                    </ListItem.Subtitle>
                                </ListItem.Content>

                            </ListItem>
                                
                        )
                    })
                    :
                    <>
                    <ActivityIndicator
                        style={Styles.loading}
                        size='large'
                    />
                    <Text
                        style={Styles.centerText}
                    >
                        Loading, please wait
                    </Text>
                    </>
            }
            <View style={Styles.commonMargins}>
                <Button
                    style={Styles.input}
                    title='New Tintero'
                    onPress={goToNewTintero}
                />
                <Button
                    style={Styles.inputGroup}
                    title='Logout'
                    onPress={logoutUser}
                />

            </View>
        </ScrollView>
    )
}

export default Tinteros
