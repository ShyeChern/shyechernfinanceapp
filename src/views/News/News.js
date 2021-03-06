import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Image, RefreshControl } from 'react-native';
import { baseUrl, secret, getUserId, getSession } from "~/util/Constant.js";
import { format } from 'date-fns';
import FastImage from 'react-native-fast-image';

export default function News({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [newsList, setNewsList] = useState([])
  const { stockSymbol } = route.params;

  useEffect(() => {
    getNewsList();
    return () => {
      setNewsList([]);
    }
  }, []);


  const getNewsList = async () => {
    setIsLoading(true);
    let session = await getSession();
    let userId = await getUserId();
    await fetch(baseUrl + `news/getNewsList/${userId}/${stockSymbol}`, {
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
          let newsData = [];
          resBody.data.items.result.forEach(value => {
            newsData.push(value);
          });
          setNewsList(newsData);
        } else {
          alert(resBody.message);
        }

      }).catch((error) => {
        alert(error);
      });


    setIsLoading(false);
  }


  const NewsData = ({ data }) => {
    return (
      <TouchableOpacity style={styles.news} onPress={() => navigation.navigate('NewsDetail', { link: data.link, title: stockSymbol })}>
        <View style={styles.newsImageView}>
          {
            data.main_image === null ?
              <Image
                style={styles.newsImage}
                source={require('~/assets/img/no-image.jpg')}
                resizeMode={'cover'}
              />
              :
              <FastImage
                style={styles.newsImage}
                source={{
                  uri: data.main_image.original_url,
                  priority: FastImage.priority.low,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
          }
        </View>
        <View style={styles.newsItem}>
          <Text style={styles.newsTitle}>{data.title}</Text>
          <Text style={styles.newsInfoText}>{data.publisher}</Text>
          <Text style={styles.newsInfoText}>{format(new Date(data.published_at * 1000), 'dd MMM yyyy')}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.newsList}
        data={newsList}
        onRefresh={() => getNewsList()}
        refreshing={isLoading}
        renderItem={useMemo(() => ({ item }) => <NewsData data={item} />, [newsList])}
        keyExtractor={item => item.uuid}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        ListHeaderComponent={() => <View style={styles.newsHeader}><Text style={styles.newsHeaderText}>List of News</Text></View>}
        ListEmptyComponent={() => isLoading && newsList.length !== 0 ? <Text style={styles.infoText}>...</Text> : <Text style={styles.infoText}>Currently no news for this stock</Text>}
        ListFooterComponent={() => newsList.length > 0 ? <Text style={styles.infoText}>End of List</Text> : null}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf6f5',
  },
  newsList: {
    flex: 1
  },
  newsHeader: {
    borderWidth: 1,
    justifyContent: 'center',
    margin: 10
  },
  newsHeaderText: {
    fontSize: 18,
    textAlign: 'center',
    padding: 10
  },
  news: {
    backgroundColor: '#d2f0fc',
    borderWidth: 1,
    margin: 10,
    flex: 1,
    flexDirection: 'row'
  },
  newsImageView: {
    flex: 1
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  newsItem: {
    flex: 3,
    marginLeft: 15,
    marginVertical: 10
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  newsInfoText: {
    fontSize: 14
  },
  infoText: {
    textAlign: 'center',
    fontStyle: 'italic'
  }
})
