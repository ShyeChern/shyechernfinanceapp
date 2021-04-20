import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { baseUrl, secret, getUserId, getSession } from "~/util/Constant.js";
import { format, parseISO } from 'date-fns';

export default function Stock({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [stock, setStock] = useState([]);
  const [marketReturn, setMarketReturn] = useState('Loading...');
  const [riskFree, setRiskFree] = useState('Loading...');
  const [marketLastUpdate, setMarketLastUpdate] = useState('Loading...');
  const isFocused = useIsFocused();

  useEffect(() => {
    getMarket();
    getStock();
    return () => {
      setStock([]);
    }
  }, [])

  useEffect(() => {
    if (route.params?.refreshStock) {
      route.params.refreshStock = false;
      getStock();
    }
  }, [isFocused]);

  const getMarket = async () => {
    let session = await getSession();
    let userId = await getUserId();
    await fetch(baseUrl + `market/getMarket/${userId}`, {
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
          setMarketReturn(resBody.data.marketReturn.$numberDecimal);
          setRiskFree(resBody.data.riskFree.$numberDecimal);
          setMarketLastUpdate(format(parseISO(resBody.data.updatedAt), 'dd MMM yyyy'));
        } else {
          alert(resBody.message);
        }

      }).catch((error) => {
        alert(error);
      });
  }

  const getStock = async () => {
    setIsLoading(true);
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
          resBody.data.stock.sort((a, b) => {
            if (a.symbol < b.symbol) {
              return -1;
            }
            if (a.symbol > b.symbol) {
              return 1;
            }
            return 0;
          })
          setStock(resBody.data.stock);
        } else {
          alert(resBody.message);
        }

      }).catch((error) => {
        alert(error);
      });
    setIsLoading(false);
  }

  const StockData = ({ data }) => {
    return (
      <TouchableOpacity style={styles.stock} onPress={() => navigation.navigate('StockDetail',
        { stock: data, riskFree: riskFree, marketReturn: marketReturn, title: data.symbol })}>
        <Text>{data.symbol}</Text>
        <Text>{data.name}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topView}>
        <View>
          <Text style={styles.marketText}>Market Return Rate: {marketReturn}</Text>
          <Text style={styles.marketText}>Risk Free Rate: {riskFree}</Text>
          <Text style={styles.marketText}>Last Update: {marketLastUpdate}</Text>
        </View>
        <View style={styles.topBtnView}>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddStock')}>
            <Text>Add Stock</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        style={styles.stockList}
        data={stock}
        onRefresh={() => getStock()}
        refreshing={isLoading}
        renderItem={useMemo(() => ({ item }) => <StockData data={item} />, [stock])}
        keyExtractor={item => item.id}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        ListHeaderComponent={() => <View style={styles.stockHeader}><Text style={styles.stockHeaderText}>List of Stock</Text></View>}
        ListEmptyComponent={() => isLoading && stock.length !== 0 ? <Text style={styles.infoText}>...</Text> : <Text style={styles.infoText}>Currently there is not stock in your account{"\n"}Add one now?</Text>}
        ListFooterComponent={() => stock.length > 0 ? <Text style={styles.infoText}>End of List</Text> : null}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf6f5',
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  topBtnView: {
    justifyContent: 'center',
  },
  addBtn: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#00ff00',
    padding: 15
  },
  marketText: {
    fontSize: 16
  },
  stockList: {
    flex: 1
  },
  stockHeader: {
    borderWidth: 1,
    justifyContent: 'center',
    margin: 10
  },
  stockHeaderText: {
    fontSize: 18,
    textAlign: 'center',
    padding: 10
  },
  stock: {
    backgroundColor: '#d2f0fc',
    borderWidth: 1,
    margin: 10,
    padding: 15
  },
  infoText: {
    textAlign: 'center',
    fontStyle: 'italic'
  }
})
