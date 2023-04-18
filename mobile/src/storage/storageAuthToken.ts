import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN__STORAGE } from "./storageConfig";

export const storageTokenSave = async(token:string) =>{
    await AsyncStorage.setItem(AUTH_TOKEN__STORAGE, token);
}

export const storageTokenGet = async() =>{
   const token = await AsyncStorage.getItem(AUTH_TOKEN__STORAGE);
   return token; 
}

export const storageTokenRemove = async() =>{
    await AsyncStorage.removeItem(AUTH_TOKEN__STORAGE);
 }