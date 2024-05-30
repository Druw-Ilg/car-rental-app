/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from 'react';
import { View, StyleSheet, Image, Text, Button } from 'react-native';
import { Title } from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const CarDetailsScreen = ({ route, navigation }) => {
	const { brandTitle, cover, details } = route.params;
	return (
		<View>
			<Image source={cover} style={styles.cover} />
			<Title style={styles.title}>{brandTitle}</Title>
			<Text style={styles.details}>{details + '.'}</Text>
			<Button title="Contacter" onPress={() => navigation.navigate('SignUp')} />
		</View>
	);
};

const styles = StyleSheet.create({
	cover: {
		width: '100%',
		height: 250
	},
	title: {
		fontSize: 28,
		padding: 12
	},
	details: {
		fontSize: 18,
		fontWeight: '300',
		paddingHorizontal: 12,
		paddingBottom: 20
	}
	// contactButton: {
	// 	width: '50%'
	// }
});

export default CarDetailsScreen;
