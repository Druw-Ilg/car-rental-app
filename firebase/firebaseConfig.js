// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat';
// TODO: Add SDKs for Firebase products that you want to use

import {
	getReactNativePersistence,
	connectAuthEmulator,
	initializeAuth,
	getAuth
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyCiJqMxVSy-ww5xVMTr2cYBkUnemVYI7bY',
	authDomain: 'car-rental-backend01.firebaseapp.com',
	projectId: 'car-rental-backend01',
	storageBucket: 'car-rental-backend01.appspot.com',
	messagingSenderId: '630901504141',
	appId: '1:630901504141:web:36fc931b88ab779dc58ac4'
};

// Initialize Firebase
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

// use a local emulator on dev
// Initialize Auth
export const auth = __DEV__ && getAuth();
// connect to emulator for dev purposes
connectAuthEmulator(auth, 'http://10.0.2.2:9099/');

//Initialize Firestore
export const db = __DEV__ && getFirestore();
// connect to emulator for dev purposes
connectFirestoreEmulator(db, '10.0.2.2', 8080);

/*
 *	Put firebase info back after development stage:
 *	"app" for initializer functions
 *	Remove emulator's connections
 */
