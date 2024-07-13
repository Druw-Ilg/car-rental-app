/* eslint-disable react/prop-types */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomDrawerContent = ({ navigation }) => {
	const handleLinkPress = (screenName) => {
		navigation.navigate(screenName);
	};

	// monitorStateChanged();
	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.link}
				onPress={() => handleLinkPress('Connexion')}
			>
				<Text style={styles.linkText}>
					<Icon name="login" size={30} color="#000" /> Se connecter
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
