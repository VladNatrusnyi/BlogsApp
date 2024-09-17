import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyAxzqEp2_tQI6pe7JkIFr0I-iwdMpqmdfw",
    authDomain: "blogsapp-e1f6a.firebaseapp.com",
    databaseURL: "https://blogsapp-e1f6a-default-rtdb.firebaseio.com",
    projectId: "blogsapp-e1f6a",
    storageBucket: "blogsapp-e1f6a.appspot.com",
    messagingSenderId: "242535688046",
    appId: "1:242535688046:web:263a2b3545f0a9dcfc837f"
};


export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getDatabase()
