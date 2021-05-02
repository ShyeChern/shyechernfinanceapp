import Config from "react-native-config";
import base64 from "base-64";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const baseUrl = Config.BASE_URL;
export const secret = base64.encode(`${Config.AUTH_NAME}:${Config.AUTH_PASS + Config.AUTH_SALT}`);
export const getSession = async () => { return await AsyncStorage.getItem('session') }
export const getUserId = async () => { return await AsyncStorage.getItem('userId') }