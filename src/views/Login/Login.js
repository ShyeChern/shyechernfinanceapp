import React, { useState, useRef, useContext } from 'react';
import { StyleSheet, Image, Text, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { authContext } from '~/index.js';
import { baseUrl, secret } from "~/util/Constant.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [instruction, setInstruction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const passwordInputRef = useRef(null);
  const { loginSession } = useContext(authContext);

  const login = async () => {
    setInstruction('');
    if (username === '' || password === '') {
      setInstruction('Please enter username and password');
    } else {
      setIsLoading(true);
      await fetch(baseUrl + 'user/login', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: 'Basic ' + secret,
          timestamp: new Date().getTime(),
          'mobile-app-session': ''
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      }).then(res => res.json())
        .then(async (resBody) => {
          if (resBody.result) {
            await AsyncStorage.setItem('session', resBody.data.mobileAppSession);
            await AsyncStorage.setItem('userId', resBody.data.id);
            setIsLoading(false);
            loginSession();
          } else {
            setInstruction(resBody.message);
            setIsLoading(false);
          }
        }).catch((error) => {
          setInstruction(error.message);
          setIsLoading(false);
        });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.view}>
        <Image source={require('~/assets/logo/circle.png')} style={styles.logo} />
        <Text style={styles.appText}>Welcome To</Text>
        <Text style={styles.appText}>Shye Chern Finance App</Text>
        {
          isLoading ? <ActivityIndicator size="large" color="#87ceeb" /> : null
        }
        <Text style={styles.warningText}>{instruction}</Text>
        <Text style={styles.labelText}>Username</Text>
        <TextInput style={styles.inputField} placeholder='Username' editable={!isLoading}
          onChangeText={value => setUsername(value)} value={username} returnKeyType={"next"}
          onSubmitEditing={() => passwordInputRef.current.focus()}
        />
        <Text style={styles.labelText}>Password</Text>
        <TextInput style={styles.inputField} placeholder='Password' editable={!isLoading}
          onChangeText={value => setPassword(value)} value={password} secureTextEntry={true}
          returnKeyType={"done"} ref={passwordInputRef}
        />

        <TouchableOpacity onPress={() => login()} style={styles.btn}>
          <Text style={styles.labelText}>Login</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf6f5',
  },
  view: {
    alignItems: 'center',
    flexGrow: 1,
    marginTop: 20
  },
  logo: {
    height: 100,
    width: 100,
  },
  appText: {
    fontSize: 25,
    margin: 10,
    fontWeight: 'bold'
  },
  labelText: {
    fontSize: 18,
    margin: 5,
  },
  warningText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'red'
  },
  inputField: {
    width: '60%',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    textAlign: 'center'
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#87ceeb',
    borderRadius: 50,
    width: '60%',
    height: 50,
    marginVertical: 30
  }
})
