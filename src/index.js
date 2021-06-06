import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '~/views/SplashScreen/SplashScreen.js';
import { AuthNavigator, MainNavigator } from '~/navigator/Navigator.js';
import { baseUrl, secret, getUserId, getSession } from "~/util/Constant.js";

export const authContext = createContext();
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const authContextValue = useMemo(
    () => ({
      loginSession: () => {
        setIsLogin(true);
      },
      logoutSession: () => {
        setIsLogin(false);
      }
    }),
    []
  );

  useEffect(() => {
    const checkLogin = async () => {
      try {
        let session = await getSession();
        let userId = await getUserId();
        // fetch
        if (session === null || session === '' || userId === null || userId === '') {
          setIsLogin(false);
          setIsLoading(false);
        } else {
          await fetch(baseUrl + 'user/checkUpdateMobileAppSession', {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              authorization: 'Basic ' + secret,
              timestamp: new Date().getTime(),
              'mobile-app-session': session
            },
            body: JSON.stringify({
              userId: userId
            })
          }).then(res => res.json())
            .then(async (resBody) => {
              if (resBody.result) {
                await AsyncStorage.setItem('session', resBody.data.mobileAppSession);
                setIsLogin(true);
                setIsLoading(false);
              } else {
                setIsLoading(false);
                setIsLogin(false);
              }
            }).catch((error) => {
              alert(error);
              setIsLoading(false);
              setIsLogin(false);
            });
        }
      } catch (e) {
        alert(e);
        setIsLoading(false);
        setIsLogin(false);
      }
    }
    checkLogin();
    return () => {
    }
  }, []);

  if (isLoading) {
    return (
      <SplashScreen />
    )
  } else {
    if (isLogin) {
      return (
        <authContext.Provider value={authContextValue}>
          <MainNavigator />
        </authContext.Provider>
      );
    } else {
      return (
        <authContext.Provider value={authContextValue}>
          <AuthNavigator />
        </authContext.Provider>
      );
    }
  }
};







