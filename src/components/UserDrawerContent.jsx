/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */

import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { AuthContext } from '../utils/AuthContext';
import * as SecureStore from 'expo-secure-store';
import CustomDrawerContent from './CustomDrawerContent';

const UserMenu = ({ navigation, handleLinkPress }) => {
	const { userData, logout } = useContext(AuthContext);
	const [avatar, setAvatar] = useState(null);

	useEffect(() => {
		fetchAvatar();
	}, []);

	const fetchAvatar = async () => {
		if (userData) {
			const q = query(
				collection(db, 'avatar'),
				where('userId', '==', userData.uid)
			);
			const querySnapshot = await getDocs(q);
			if (querySnapshot.docs.length > 0) {
				try {
					setAvatar(querySnapshot.docs[0].data());
				} catch (error) {
					console.error(error);
				}
			}
		}
	};
	return (
		<>
			<TouchableOpacity
				style={styles.link}
				onPress={() => handleLinkPress('Profile')}
			>
				{avatar ? (
					<View style={{ flexDirection: 'row' }}>
						<Image
							source={{ uri: avatar.downloadUrl }}
							style={styles.avatarImage}
						/>
						<Text style={[styles.linkText, { paddingTop: 17 }]}>
							{userData.name}
						</Text>
					</View>
				) : (
					<Text style={styles.linkText}>
						<AntIcon name="user" size={30} color="#000" /> {userData.name}
					</Text>
				)}
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.link}
				onPress={() => handleLinkPress('UserSettings')}
			>
				<Text style={styles.linkText}>
					<AntIcon name="setting" size={30} color="#000" /> Préférences
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.logoutButton}
				onPress={() => logout(navigation)}
			>
				<Text style={styles.logoutText}>
					<Icon name="logout" size={20} color="#000" /> Se déconnecter
				</Text>
			</TouchableOpacity>
		</>
	);
};

const UserDrawerContent = ({ navigation }) => {
	const [isLogedIn, setIsLogedIn] = useState(false);

	const handleLinkPress = (screenName) => {
		navigation.navigate(screenName);
	};

	useEffect(() => {
		async function getUserData() {
			// get the user data from SecureStore session
			const user = await SecureStore.getItemAsync('user');

			if (user) {
				setIsLogedIn(true);
			} else {
				console.log('Aucun utilisateur connecté!');
				setIsLogedIn(false);
			}
		}
		getUserData();
	}, []);

	return (
		<View style={styles.container}>
			{isLogedIn ? (
				<UserMenu navigation={navigation} handleLinkPress={handleLinkPress} />
			) : (
				<CustomDrawerContent />
			)}

			{/* Add more links as needed */}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 50,
		paddingHorizontal: 10
	},
	link: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginVertical: 5,
		borderBottomWidth: 0.5,
		backgroundColor: '#f5f5f5'
	},
	linkText: {
		color: '#000',
		fontSize: 22
	},
	avatarImage: {
		width: 50,
		height: 50,
		borderRadius: 12,
		marginRight: 10
	},
	logoutButton: {
		backgroundColor: '#E0E0E0',
		borderRadius: 8,
		paddingVertical: 15,
		alignItems: 'center',
		marginVertical: 30
	},
	logoutText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333'
	}
});

export default UserDrawerContent;
