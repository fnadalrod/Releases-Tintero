import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import db, { auth } from "../components/firebase";

import Styles from "../Styles";

const Register = (props) => {
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
    tinteros: [
      {
        name: "primer tintero",
        with: "yourself",
      },
    ],
  });

  const handleTextChange = (name, value) => {
    setAuthData({ ...authData, [name]: value });
  };

  const registerUser = async () => {
    // validation
    if (authData.name === "") {
      alert("Please enter your name");
    } else if (authData.email === "") {
      alert("Please enter your email");
    } else if (authData.password === "") {
      alert("Please enter your password");
    } else {
      // registering the user through
      // firebase with email and password
      const newUser = await auth
        .createUserWithEmailAndPassword(authData.email, authData.password)
        .then(
          console.log("succesfully registered"),
          console.log("new user:", newUser)
        )
        .catch((error) => {
          console.log("oops there was an error:", error);
        });
      const userId = newUser.user.uid;

      // adding the user to the database
      const userToDatabase = db.collection("tinteroUsers").doc(userId).set({
        name: authData.name,
        email: authData.email,
        password: authData.password,
        tinteros: authData.tinteros,
        photoUrl: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.xovi.com%2Fgoogle-focus-on-the-user-and-all-else-will-follow%2F&psig=AOvVaw2krAsW9q6X_4BsJve8N6DW&ust=1607974144384000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCPDh7NHYy-0CFQAAAAAdAAAAABAD'
      })
      .then(
          console.log('successfully saved to db')
      )
      .catch( (error) => {
          console.log('something wrong saving the user to db: ', error)
      } )
      ;

    }
  };

  return (
    <View style={Styles.container}>
      <Text style={Styles.viewTitle}>Create your account</Text>
      <View style={Styles.inputGroup}>
        <Text>Please enter your name</Text>
        <TextInput
            style={Styles.input}
            onChangeText={(value) => handleTextChange('name', value)}
            placeholder='John'
        />
        <Text>Please enter your email</Text>
        <TextInput
            style={Styles.input}
            onChangeText={(value) => handleTextChange('email', value)}
            placeholder='john@gmail.com'
        />
        <Text>Please enter your password</Text>
        <TextInput
            style={Styles.input}
            onChangeText={(value) => handleTextChange('password', value)}
            placeholder='password'
        />

        <Button
            style={Styles.input}
            title='Create account'
            onPress={registerUser}
        />
      </View>
    </View>
  );
};

export default Register;
