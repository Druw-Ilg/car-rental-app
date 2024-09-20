/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat';
import { initializeApp } from 'firebase/app';
import 'firebase/messaging';
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
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
	apiKey: 'AIzaSyCiJqMxVSy-ww5xVMTr2cYBkUnemVYI7bY',
	authDomain: 'car-rental-backend01.firebaseapp.com',
	databaseURL:
		'https://car-rental-backend01-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'car-rental-backend01',
	storageBucket: 'car-rental-backend01.appspot.com',
	messagingSenderId: '630901504141',
	appId: '1:630901504141:web:36fc931b88ab779dc58ac4'
};

// Initialize Firebase
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

const requestNotificationPermission = async () => {
	try {
		await messaging.requestPermission();
		const token = await messaging.getToken({
			vapidKey:
				'BDgaHjCEuCmSb46IiPHfw19eR7UhqhOaI5ksbZJTy4mKGyAkPBqeZVNCebJGhrNcoWB01u_6Z2XF1N0CIH9HpBw'
		});
		console.log('FCM Token:', token);
		return token;
	} catch (error) {
		console.error('Error getting permission for notifications', error);
	}
};

// use a local emulator on dev
// __DEV__ &&
// Initialize Auth
// export const auth = getAuth(app);
export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
// connect to emulator for dev purposes
// connectAuthEmulator(auth, 'http://10.0.2.2:9099/');

//Initialize Firestore
export const db = getFirestore(app);
// connect to emulator for dev purposes
// connectFirestoreEmulator(db, '10.0.2.2', 8080);

// Initialize cloud storage
export const storage = getStorage(app);
// Point to the Storage emulator running on localhost.
// connectStorageEmulator(storage, '10.0.2.2', 9199);

/*
 *	Put firebase info back after development stage:
 *	"app" for initializer functions
 *	Remove emulator's connections
 */
