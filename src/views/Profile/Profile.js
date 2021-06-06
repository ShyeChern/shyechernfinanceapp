import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { baseUrl, secret, getUserId, getSession } from "~/util/Constant.js";
import { format, parseISO } from 'date-fns';
import { authContext } from '~/index.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile({ navigation }) {
  const [username, setUsername] = useState("Loading...");
  const [totalStock, setTotalStock] = useState("Loading...");
  const [createdDate, setCreatedDate] = useState("Loading...");
  const { logoutSession } = useContext(authContext);

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

  const logout = async () => {
    let session = await getSession();
    let userId = await getUserId();
    await fetch(baseUrl + `user/logout/${userId}`, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Basic ' + secret,
        timestamp: new Date().getTime(),
        'mobile-app-session': session
      },
    }).then(res => res.json())
      .then((resBody) => {
        if (!resBody.result) {
          alert(resBody.message);
        }
      })
      .catch((error) => {
        alert(error.message);
      });

    await AsyncStorage.removeItem('session');
    await AsyncStorage.removeItem('userId');
    logoutSession();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileDataView}>
        <View style={styles.profileData}>
          <Text style={styles.profileDataText}>Username: {username}</Text>
          <Text style={styles.profileDataText}>Total Stock: {totalStock}</Text>
          <Text style={styles.profileDataText}>Account Created At: {createdDate}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()} ><Text style={styles.btnText}>Logout</Text></TouchableOpacity>
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
  },
  logoutBtn: {
    backgroundColor: '#d2f0fc',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginVertical: 20
  },
  btnText: {
    fontSize: 18
  }
})
