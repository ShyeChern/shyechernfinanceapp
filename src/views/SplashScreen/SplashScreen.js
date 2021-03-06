import React from 'react';
import { StyleSheet, Image, Text, ActivityIndicator, SafeAreaView, ScrollView, Alert } from 'react-native';

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.view}>
        <Image source={require('~/assets/logo/circle.png')} style={styles.logo} />
        <Text style={styles.appText}>Shye Chern Finance App</Text>
        <ActivityIndicator size="large" color="#87ceeb" />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf6f5',
  },
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1
  },
  logo: {
    height: 200,
    width: 200,
  },
  appText: {
    fontSize: 25,
    margin: 10,
  }
})
