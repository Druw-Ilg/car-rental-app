/* eslint-disable react/prop-types */

import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { auth, db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userData, setUserData] = useState(null);

	useEffect(() => {
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

			// create user session

			if (userInfo) {
				await SecureStore.setItemAsync('user', JSON.stringify(userInfo));
				setUserData(userInfo);
				navigation.navigate('Home');
			}
		} catch (error) {
			console.log(error);
		}
	};

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
		<AuthContext.Provider value={{ userData, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
