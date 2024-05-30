// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to use

import { getAuth, connectAuthEmulator } from 'firebase/auth';
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
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
connectAuthEmulator(auth, 'http://localhost:9099');
