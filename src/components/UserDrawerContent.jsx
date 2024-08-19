/* eslint-disable react/prop-types */
// User drawer Content

import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../utils/AuthContext';
import * as SecureStore from 'expo-secure-store';
import AntIcon from 'react-native-vector-icons/AntDesign';
import CustomDrawerContent from './CustomDrawerContent';

const UserMenu = ({ handleLinkPress, navigation }) => {
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
			<TouchableOpacity style={styles.link} onPress={() => {navigation.navigate('Booking Requests')}}>
				<Text style={styles.linkText}>
					<Icon name="book" size={30} color="#000" /> My Bookings
				</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.link} onPress={() => logout(navigation)}>
				<Text style={styles.linkText}>
					<Icon name="logout" size={30} color="#000" /> Se déconnecter
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
		const getUsrData = async () => {
			const user = await SecureStore.getItemAsync('user');

			if (user) {
				setIsLogedIn(true);
			} else {
				console.error("Couldn't log in the member");

				setIsLogedIn(false);
			}
		};
		getUsrData();
	}, []);

	return (
		<View style={styles.container}>
			{isLogedIn ? (
				<UserMenu handleLinkPress={handleLinkPress} navigation={navigation} />
			) : (
				<CustomDrawerContent />
			)}
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
		borderRadius: 5
	},
	linkText: {
		color: '#000',
		fontSize: 22
	}
});

export default UserDrawerContent;
