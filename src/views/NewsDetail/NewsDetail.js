import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function NewsDetail({ route, navigation }) {
  const { link } = route.params;

  return (
    <WebView source={{ uri: link }} />
  )
}

const styles = StyleSheet.create({})
