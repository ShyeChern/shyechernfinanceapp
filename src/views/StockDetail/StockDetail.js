import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { baseUrl, secret, getUserId, getSession } from "~/util/Constant.js";
import { format, parseISO } from 'date-fns';

export default function Stock({ route, navigation }) {
  const { stock, riskFree, marketReturn } = route.params;

  const deleteStock = async () => {
    let session = await getSession();
    let userId = await getUserId();
    fetch(baseUrl + `stock/deleteStock/${userId}`, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Basic ' + secret,
        timestamp: new Date().getTime(),
        'mobile-app-session': session
      },
      body: JSON.stringify({
        stockId: stock.id
      }),
    }).then(res => res.json())
      .then((resBody) => {
        alert(resBody.message);
        if (resBody.result) {
          navigation.navigate('Stock', { refreshStock: true })
        }
      }).catch((error) => {
        alert(error);
      });
  }

  const updateStock = async () => {
    let session = await getSession();
    let userId = await getUserId();
    fetch(baseUrl + `stock/getStock/${userId}`, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Basic ' + secret,
        timestamp: new Date().getTime(),
        'mobile-app-session': session
      },
      body: JSON.stringify({
        symbol: stock.symbol
      }),
    }).then(res => res.json())
      .then((resBody) => {
        if (resBody.result) {
          navigation.navigate('Stock', { refreshStock: true })
        } else {
          alert(resBody.message);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoView}>
        <Text style={styles.infoLabel}>{stock.name} ({stock.symbol})</Text>
        <Text style={styles.infoLabel}>Market Return Rate: <Text style={styles.infoText}>{marketReturn}</Text></Text>
        <Text style={styles.infoLabel}>Risk Free Rate: <Text style={styles.infoText}>{riskFree}</Text></Text>
        <Text style={styles.infoLabel}>Beta: <Text style={styles.infoText}>{stock.beta.$numberDecimal}</Text></Text>
        <Text style={styles.infoLabel}>Required Return (5 Years): <Text style={styles.infoText}>{(parseFloat(riskFree) + (parseFloat(stock.beta.$numberDecimal) * (parseFloat(marketReturn) - parseFloat(riskFree)))).toFixed(4)} </Text></Text>
        <Text style={styles.infoLabel}>Actual Return (5 Years) : <Text style={styles.infoText}>{stock.actualReturn.$numberDecimal}</Text></Text>
        <Text style={styles.infoLabel}>Last Update: <Text style={styles.infoText}>{format(parseISO(stock.updatedAt), 'dd MMM yyyy')}</Text></Text>
      </View>

      <View style={styles.btnView}>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteStock()}>
          <Text style={styles.btnText}>Delete Stock</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.updateBtn} onPress={() => updateStock()}>
          <Text style={styles.btnText}>Update Stock</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btnView}>
        <TouchableOpacity style={styles.newsBtn} onPress={() => navigation.navigate('News', { stockSymbol: stock.symbol, title: stock.symbol })}>
          <Text style={styles.btnText}>View News</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf6f5',
  },
  infoView: {
    marginHorizontal: 30,
    marginVertical: 15
  },
  infoLabel: {
    fontWeight: 'bold',
    fontSize: 18
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'normal',
  },
  btnView: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    margin: 10
  },
  deleteBtn: {
    backgroundColor: '#FF4343',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1
  },
  newsBtn: {
    backgroundColor: '#d2f0fc',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1
  },
  updateBtn: {
    backgroundColor: '#00ff00',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1
  },
  btnText: {
    fontSize: 18
  }
})
