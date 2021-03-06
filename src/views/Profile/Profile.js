import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { baseUrl, secret, getUserId, getSession } from "~/util/Constant.js";
import { format, parseISO } from 'date-fns';

export default function Profile({ navigation }) {
  const [username, setUsername] = useState("Loading...");
  const [totalStock, setTotalStock] = useState("Loading...");
  const [createdDate, setCreatedDate] = useState("Loading...");

  useEffect(() => {
    getUser();
    return () => {
    }
  }, [])

  const getUser = async () => {
    let session = await getSession();
    let userId = await getUserId();
    await fetch(baseUrl + `user/getUser/${userId}`, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Basic ' + secret,
        timestamp: new Date().getTime(),
        'mobile-app-session': session
      },
    }).then(res => res.json())
      .then(async (resBody) => {
        if (resBody.result) {
          setUsername(resBody.data.username);
          setTotalStock(resBody.data.stock.length);
          setCreatedDate(format(parseISO(resBody.data.createdAt), 'dd-MM-yyyy hh:mm a'));
        } else {
          alert(resBody.message);
        }

      }).catch((error) => {
        alert(error);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileDataView}>
        <View style={styles.profileData}>
          <Text style={styles.profileDataText}>Username: {username}</Text>
          <Text style={styles.profileDataText}>Total Stock: {totalStock}</Text>
          <Text style={styles.profileDataText}>Account Created At: {createdDate}</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf6f5',
  },
  profileDataView: {
    alignItems: 'center',
    flex: 1
  },
  profileData: {
    justifyContent: 'center',
    flex: 1
  },
  profileDataText: {
    fontSize: 18
  }
})
