/* eslint-disable react/prop-types */

import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { auth, db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithRedirect,
	getRedirectResult,
	signOut
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		// refresh user
		const loadUser = async () => {
			try {
				const user = await SecureStore.getItemAsync('user');
				if (user) {
					setUserData(JSON.parse(user));
				}
			} catch (error) {
				console.error('Error loading user from SecureStore', error);
			}
		};

		loadUser();
	}, []);

	const login = async (email, password, navigation) => {
		try {
			const userSignInInfo = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userSignInInfo.user;

			// get user's info from database
			const q = query(
				collection(db, 'users'),
				where('email', '==', user.email)
			);

			const querySnapshot = await getDocs(q);
			const userInfo = querySnapshot.docs[0]?.data();
			userInfo['uid'] = user.uid; //Add the user id

			// create user session

			if (userInfo) {
				await SecureStore.setItemAsync('user', JSON.stringify(userInfo));
				setUserData(userInfo);
				navigation.navigate('Home');
			}
		} catch (error) {
			console.error('AuthContext: ', error);
			return error.message;
		}
	};

	//***************** Google Signin ***************//
	const googleSignIn = async (navigation) => {
		try {
			signInWithRedirect(auth, googleProvider);

			getRedirectResult(auth)
				.then(async (result) => {
					// This gives you a Google Access Token. You can use it to access Google APIs.
					const credential = GoogleAuthProvider.credentialFromResult(result);
					const token = credential.accessToken;
					// The signed-in user info.
					if (token) {
						const user = result.user;
						await SecureStore.setItemAsync('user', JSON.stringify(user));
						setUserData(user);
						navigation.navigate('Home');
					}

					// IdP data available using getAdditionalUserInfo(result)
				})
				.catch((error) => {
					// Handle Errors here.
					// const errorCode = error.code;
					const errorMessage = error.message;
					// The email of the user's account used.
					// const email = error.customData.email;
					// The AuthCredential type that was used.
					// const credential = GoogleAuthProvider.credentialFromError(error);

					return errorMessage;
				});
		} catch (error) {
			return error;
		}
	};
	//***************** Google Signin ***************//
	const logout = async (navigation) => {
		try {
			await signOut(auth);
			setUserData(null);
			await SecureStore.deleteItemAsync('user');
			navigation.navigate('Home');
		} catch (error) {
			console.error(
				'Une erreur est survenue lors de la déconnexion: ',
				error.message
			);
		}
	};

	return (
		<AuthContext.Provider value={{ userData, login, googleSignIn, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
