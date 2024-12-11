import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { UserContext } from 'components/UserInfo';
import Toast from 'react-native-toast-message';

export default function SignUpScreen({navigation}) {
  const {setUsername, setUserId, email} = useContext(UserContext);
  const [newUser, setNewUser] = useState('');
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if(load){
      loginUser();
    }
  }, [])

  const loginUser = async() => {
    // https://group8-project3-09c9182c5047.herokuapp.com/user/users/login/?email={}
    const options = {
      method: 'GET',
      url: 'https://group8-project3-09c9182c5047.herokuapp.com/user/users/login/',
      params: {
        'email': email
      }
    };
    try {
      const response = await axios.request(options);
      console.log(response.data);
      setUsername(response.data.UserInfo.username);
      setUserId(response.data.UserInfo.user_id)
      navigation.navigate("DrawerNavigator", {screen: "Profile"});
      setLoad(false);
    } catch(error) {
      console.log('Fetching User:',error);
      setLoad(false);
    }
  }

  const createUser = async() => {
    if (newUser == '') {
      //username cant be empty
      return;
    }

    // https://group8-project3-09c9182c5047.herokuapp.com/user/users/createUser/?username={}&password={}&email={}
    const options = {
      method: 'POST',
      url: 'https://group8-project3-09c9182c5047.herokuapp.com/user/users/createUser/',
      params: {
        'username': newUser,
        'password': '',
        'email': email
      }
    };
    try {
      const response = await axios.request(options);
      console.log(response.data);
      setUsername(response.data.User.username);
      setUserId(response.data.User.user_id)
      navigation.reset({
        index: 0,
        routes: [{ name: "DrawerNavigator", params: { screen: "Profile", params: { screen: "One" } } }],
      });
    } catch(error) {
      // console.error('Error Creating User:',error);
      // username unavailable
    }
  }


  return (
    <View style={styles.container}>

      { load? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ):(
        <View style={styles.container}>
          <Text style={styles.title}>Set Your Username!</Text>
          <View style={styles.separator} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={newUser}
            onChangeText={setNewUser}
          />

          <TouchableOpacity onPress={() => createUser()}>
            <Text>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
      <Toast/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  separator: {
    height: 1,
    width: '80%',
    backgroundColor: '#D1D5DB',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});