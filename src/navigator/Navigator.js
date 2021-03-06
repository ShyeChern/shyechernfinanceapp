import React from 'react';
import Landing from '~/views/Landing/Landing.js';
import Login from '~/views/Login/Login.js';
import SignUp from '~/views/SignUp/SignUp.js';
import Profile from '~/views/Profile/Profile.js';
import News from '~/views/News/News.js';
import NewsDetail from '~/views/NewsDetail/NewsDetail.js';
import Stock from '~/views/Stock/Stock.js';
import AddStock from '~/views/AddStock/AddStock.js';
import StockDetail from '~/views/StockDetail/StockDetail.js';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// Navigator setting
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOption = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  headerTintColor: '#000',
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: '#87ceeb',
  },
}

const AuthTab = () => {
  return (
    <Stack.Navigator initialRouteName={'Landing'} screenOptions={screenOption}>
      <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

const StockTab = () => {
  return (
    <Stack.Navigator initialRouteName={'Stock'} screenOptions={screenOption}>
      <Stack.Screen name="Stock" component={Stock} />
      <Stack.Screen name="AddStock" component={AddStock} />
      <Stack.Screen name="StockDetail" component={StockDetail} options={({ route }) => ({ title: route.params.title })} />
      <Stack.Screen name="News" component={News} options={({ route }) => ({ title: route.params.title })} />
      <Stack.Screen name="NewsDetail" component={NewsDetail} options={({ route }) => ({ title: route.params.title })} />
    </Stack.Navigator>
  );
}

const ProfileTab = () => {
  return (
    <Stack.Navigator initialRouteName={'Profile'} screenOptions={screenOption}>
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName={'Stock'} tabBarOptions={{
      activeTintColor: '#000000',
      activeBackgroundColor: '#87ceeb',
    }}>
      <Tab.Screen name="Stock" component={StockTab} options={{
        tabBarIcon: ({ focused, color, size }) => {
          return <SimpleLineIcons name='graph' size={30} color='#fcf6f5' />
        }
      }} />
      <Tab.Screen name="Profile" component={ProfileTab} options={{
        tabBarIcon: ({ focused, color, size }) => {
          return <SimpleLineIcons name='user' size={30} color='#fcf6f5' />
        }
      }} />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Home'} screenOptions={screenOption}>
        <Stack.Screen name="Home" component={BottomTabNavigator} options={{
          headerShown: false
        }} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export const AuthNavigator = () => {
  return (
    <NavigationContainer>
      <AuthTab />
    </NavigationContainer>
  )
}