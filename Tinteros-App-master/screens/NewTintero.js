import React, { useState, useEffect } from "react";
import { View, Text, Picker, TextInput } from "react-native";

import Styles from "../Styles";
import db, { auth } from "../components/firebase";

const NewTintero = (props) => {
  const [newTintero, setNewTintero] = useState({
    id: "",
    name: "",
    with: "",
  });

  useEffect(() => {
    getUserFriends;
    createNewTintero
  }, []);

  const currentUser = auth.currentUser;

  const handleTextChange = (name, value) => {
    setNewTintero({ ...newTintero, [name]: value });
  };

  const getUserFriends = async () => {
    
    try {
      const doc = await db
        .collection("tinterosUsers")
        .doc(currentUser.uid)
        .get();
      const userData = doc.data();
      const userFriends = userData.userFriends;
      console.log(userFriends);
    } catch (error) {
        console.log('there was an error getting userFriends: ', error )
    }
  };

  const createNewTintero = async () => {
      try {
          const doc = await db
          .collection('tinteroUsers')
          .doc(currentUser.uid)
          .update({
              tinteros: {
                  ...tinteros,
                  name: newTintero.name,
                  with: newTintero.with
              }
          })
      } catch (error) {
          
      } 
  }

  return (
    <View style={Styles.container}>
        <Text>
            testing data from other component
            
        </Text>
      <Text>Enter the name for this tintero</Text>
      <TextInput
        placeholder="Tintero"
        style={Styles.input}
        onChangeText={handleTextChange}
      />
      <Text>Select with whom do you want to have this tintero</Text>
      <Picker
        placeholder="Tintero"
        style={Styles.input}
        
      />
    </View>
  );
};

export default NewTintero;
