import React from 'react';
import { StyleSheet, Image, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

export default function Landing({ navigation }) {

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.view}>
        <Image source={require('~/assets/logo/circle.png')} style={styles.logo} />
        <Text style={styles.appText}>Welcome To</Text>
        <Text style={styles.appText}>Shye Chern Finance App</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.btn}>
          <Text style={styles.labelText}>Login Now</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.btn}>
          <Text style={styles.labelText}>Sign Up Now</Text>
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
    justifyContent: 'center',
    flexGrow: 1,
    marginTop: 20
  },
  logo: {
    height: 150,
    width: 150,
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
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#87ceeb',
    borderRadius: 50,
    width: '60%',
    height: 50,
    marginVertical: 10
  }
})
