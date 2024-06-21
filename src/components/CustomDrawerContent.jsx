/* eslint-disable react/prop-types */

import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from '../../firebase/firebaseConfig';

const CustomDrawerContent = ({ navigation }) => {
	const [isLogedIn, setIsLogedIn] = useState(false);

	const handleLinkPress = (screenName) => {
		navigation.navigate(screenName);
	};

	//lpgout
	const logout = async () => {
		await signOut(auth);
		monitorStateChanged();
	};

	// if auuth state changed
	const monitorStateChanged = async () => {
		await onAuthStateChanged(auth, (user) => {
			if (user) {
				setIsLogedIn(true);

				// Navigate to Home
				navigation.navigate('HomeDrawer');
			} else {
				setIsLogedIn(false);
			}
		});
	};

	// monitorStateChanged();
	return (
		<View style={styles.container}>
			{isLogedIn ? (
				<TouchableOpacity style={styles.link} onPress={() => logout()}>
					<Text style={styles.linkText}>
						<Icon name="logout" size={30} color="#000" /> Se déconnecter
					</Text>
				</TouchableOpacity>
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

export default CustomDrawerContent;
