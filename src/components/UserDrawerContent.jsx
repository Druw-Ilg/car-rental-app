/* eslint-disable react/prop-types */
// User drawer Content

import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../utils/AuthContext';
import * as SecureStore from 'expo-secure-store';
import AntIcon from 'react-native-vector-icons/AntDesign';

const UserMenu = ({ name, handleLinkPress, navigation }) => {
	const { logout } = useContext(AuthContext);
	return (
		<>
			<TouchableOpacity
				style={styles.link}
				onPress={() => handleLinkPress('VendorScreen')}
			>
				<Text style={styles.linkText}>
					<AntIcon name="user" size={30} color="#000" /> {name}
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

	const [userData, setUserData] = useState(null);

	const handleLinkPress = (screenName) => {
		navigation.navigate(screenName);
	};

	useEffect(() => {
		const getUsrData = async () => {
			const user = await SecureStore.getItemAsync('user');

			if (user) {
				setUserData(JSON.parse(user));
				setIsLogedIn(true);
			} else {
				console.error("Couldn't log in the member");

				setIsLogedIn(false);
			}
		};
		getUsrData();
	}, []);

	console.log('UserDrawer: ', userData);
	return (
		<View style={styles.container}>
			{isLogedIn ? (
				<UserMenu
					name={userData.name}
					handleLinkPress={handleLinkPress}
					navigation={navigation}
				/>
			) : (
				<TouchableOpacity
					style={styles.link}
					onPress={() => handleLinkPress('Connexion')}
				>
					<Text style={styles.linkText}>
						<Icon name="login" size={30} color="#000" /> Se connecter
					</Text>
				</TouchableOpacity>
			)}

			<TouchableOpacity
				style={styles.link}
				onPress={() => handleLinkPress('SUV')}
			>
				<Text style={styles.linkText}>
					<Icon name="cog" size={30} color="#000" />
					SUV
				</Text>
			</TouchableOpacity>
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

export default UserDrawerContent;
