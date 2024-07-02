/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
// Vendor drawer Content

import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';

import { AuthContext } from '../utils/AuthContext';
import * as SecureStore from 'expo-secure-store';
import CustomDrawerContent from './CustomDrawerContent';

const VendorMenu = ({ name, navigation, handleLinkPress }) => {
	const { logout } = useContext(AuthContext);

	return (
		<>
			<TouchableOpacity
				style={styles.link}
				onPress={() => handleLinkPress('Profile Loueur')}
			>
				<Text style={styles.linkText}>
					<AntIcon name="user" size={30} color="#000" /> {name}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.link}
				onPress={() => handleLinkPress('Tableau de bord')}
			>
				<Text style={styles.linkText}>
					<AntIcon name="dashboard" size={30} color="#000" /> Tableau de bord
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

const VendorDrawerContent = ({ navigation }) => {
	const [isLogedIn, setIsLogedIn] = useState(false);
	const [userData, setUserData] = useState({});

	const handleLinkPress = (screenName) => {
		navigation.navigate(screenName);
	};

	useEffect(() => {
		async function getUserData() {
			const user = await SecureStore.getItemAsync('user');

			if (user) {
				setUserData(JSON.parse(user));
				setIsLogedIn(true);
			} else {
				console.log(
					"Couldn't log in the vendor. <br> From VendorDrawerContent l-45: ",
					userData
				);
				setIsLogedIn(false);
			}
		}
		getUserData();
	}, []);

	return (
		<View style={styles.container}>
			{isLogedIn ? (
				<VendorMenu
					name={userData.name}
					navigation={navigation}
					handleLinkPress={handleLinkPress}
				/>
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
		borderRadius: 5
	},
	linkText: {
		color: '#000',
		fontSize: 22
	}
});

export default VendorDrawerContent;
