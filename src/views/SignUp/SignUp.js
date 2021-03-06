import React, { useState, useRef } from 'react';
import { StyleSheet, Image, Text, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { baseUrl, secret } from "~/util/Constant.js";

export default function SignUp({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [instruction, setInstruction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  const signUp = async () => {
    setInstruction('');
    if (username === '' || password === '' || confirmPassword === '') {
      setInstruction('Please enter username and password');
    } else if (password !== confirmPassword) {
      setInstruction('Password does not matched');
    } else {
      setIsLoading(true);
      await fetch(baseUrl + 'user/signUp', {
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
          password: password,
          confirmPassword: confirmPassword
        })
      }).then(res => res.json())
        .then(async (resBody) => {
          if (resBody.result) {
            setIsLoading(false);
            alert(resBody.message);
            navigation.goBack();
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
        <Text style={styles.appText}>Sign Up</Text>
        <Text style={styles.warningText}>{instruction}</Text>
        <Text style={styles.labelText}>Username</Text>
        <TextInput style={styles.inputField} placeholder='Username' editable={!isLoading}
          onChangeText={value => setUsername(value)} value={username} returnKeyType={"next"}
          onSubmitEditing={() => passwordInputRef.current.focus()}
        />
        <Text style={styles.labelText}>Password</Text>
        <TextInput style={styles.inputField} placeholder='Password' editable={!isLoading}
          onChangeText={value => setPassword(value)} value={password} secureTextEntry={true}
          returnKeyType={"next"} ref={passwordInputRef} onSubmitEditing={() => confirmPasswordInputRef.current.focus()}
        />

        <Text style={styles.labelText}>Confirm Password</Text>
        <TextInput style={styles.inputField} placeholder='Confirm Password' editable={!isLoading}
          onChangeText={value => setConfirmPassword(value)} value={confirmPassword} secureTextEntry={true}
          returnKeyType={"done"} ref={confirmPasswordInputRef}
        />

        <TouchableOpacity onPress={() => signUp()} style={styles.btn}>
          <Text style={styles.labelText}>Sign Up</Text>
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
