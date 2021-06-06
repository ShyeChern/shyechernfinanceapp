import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { baseUrl, secret, getUserId, getSession } from "~/util/Constant.js";

export default function AddStock({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [stockList, setStockList] = useState([]);
  const [tempStockList, setTempStockList] = useState([]);
  const [stockInput, setStockInput] = useState("");
  const stockInputRef = useRef(null);

  useEffect(() => {
    stockInputRef.current.focus();
    getSampleStock();
    return () => {
    }
  }, [])

  const getSampleStock = async () => {
    let session = await getSession();
    let userId = await getUserId();
    await fetch(baseUrl + `stock/getSampleStock/${userId}`, {
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
          let stockData = [];
          resBody.data.forEach((value, index) => {
            stockData.push(value);
          });
          setStockList(stockData);
          setTempStockList(stockData);
        } else {
          alert(resBody.message);
        }

      }).catch((error) => {
        alert(error);
      });

    setIsLoading(false);
  }

  const addStock = async () => {
    if (stockInput === '') {
      alert('Please input stock symbol')
    } else {
      // make loading indicator
      setIsLoading(true);
      let session = await getSession();
      let userId = await getUserId();
      await fetch(baseUrl + `stock/getStock/${userId}`, {
        method: 'put',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: 'Basic ' + secret,
          timestamp: new Date().getTime(),
          'mobile-app-session': session
        },
        body: JSON.stringify({
          symbol: stockInput
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

      setIsLoading(false);
    }
  }

  const filterStockList = (value) => {
    setStockInput(value);

    const newTempStockList = stockList.filter(item => {
      const symbol = item.symbol.toUpperCase();
      const inputSymbol = value.toUpperCase();
      return symbol.indexOf(inputSymbol) > -1;
    });

    setTempStockList(newTempStockList);

  }

  const SampleStockData = ({ data }) => {
    return (
      <TouchableOpacity style={styles.sampleStockDataItem} onPress={() => setStockInput(data.symbol)}>
        <Text style={styles.sampleStockSymbolText}>{data.symbol} <Text style={styles.sampleStockCompanyText}>({data.name})</Text></Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stockInputView}>
        <TextInput style={styles.stockInput} onChangeText={value => filterStockList(value)} value={stockInput} ref={stockInputRef}
          placeholder={'Input Stock Symbol'} autoCapitalize={'characters'} />
        <TouchableOpacity style={styles.addBtn} onPress={() => addStock()} disabled={isLoading}>
          <Text>Add</Text>
        </TouchableOpacity>
      </View>
      {
        isLoading ? <ActivityIndicator size="large" color="#87ceeb" /> : null
      }
      <FlatList
        style={styles.stockInputList}
        data={tempStockList}
        renderItem={useMemo(() => ({ item }) => <SampleStockData data={item} />, [stockList])}
        keyExtractor={item => item.id}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        ItemSeparatorComponent={() => <View style={styles.stockListSeparator}></View>}
        ListEmptyComponent={() => isLoading && stockList.length === 0 ? <Text style={styles.infoText}>Loading...</Text> : <Text style={styles.infoText}>There is no sample stock available</Text>}
        ListFooterComponent={() => stockList.length > 0 ? <Text style={styles.infoText}>End of List</Text> : null}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf6f5',
  },
  stockInputView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10
  },
  stockInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 10,
    flex: 1,
    textAlign: 'center'
  },
  stockListSeparator: {
    borderWidth: 0.5
  },
  stockInputList: {

  },
  sampleStockDataItem: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 30
  },
  sampleStockSymbolText: {
    fontWeight: 'bold'
  },
  sampleStockCompanyText: {
    fontWeight: 'normal'
  },
  addBtn: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#00ff00',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10
  },
  infoText: {
    textAlign: 'center',
    fontStyle: 'italic'
  }
})
