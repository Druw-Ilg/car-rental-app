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
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { FIREBASE_API_KEY, FIREBASE_APP_ID } from '@env';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: FIREBASE_API_KEY,
	authDomain: 'car-rental-backend01.firebaseapp.com',
	projectId: 'car-rental-backend01',
	storageBucket: 'car-rental-backend01.appspot.com',
	messagingSenderId: '630901504141',
	appId: FIREBASE_APP_ID
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

// Initialize cloud storage
export const storage = __DEV__ && getStorage();
// Point to the Storage emulator running on localhost.
connectStorageEmulator(storage, '10.0.2.2', 9199);

/*
 *	Put firebase info back after development stage:
 *	"app" for initializer functions
 *	Remove emulator's connections
 */
