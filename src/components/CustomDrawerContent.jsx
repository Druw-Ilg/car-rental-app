/* eslint-disable react/prop-types */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { MaterialIcons, AntDesign } from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomDrawerContent = ({ navigation }) => {
	const handleLinkPress = (screenName) => {
		navigation.navigate(screenName);
	};

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

			<TouchableOpacity
				style={styles.link}
				onPress={() => handleLinkPress('OtherSettings')}
			>
				<Text style={styles.linkText}>
					<AntDesign name="setting" size={30} color="#000" /> Préférences
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.link}
				onPress={() => handleLinkPress('OtherSettings')}
			>
				<Text style={styles.linkText}>
					<MaterialIcons name="support-agent" size={30} color="#000" /> Service
					client
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
		borderBottomWidth: 0.5,
		backgroundColor: '#f5f5f5'
	},
	linkText: {
		color: '#000',
		fontSize: 22
	}
});

export default CustomDrawerContent;
