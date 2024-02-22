/* eslint-disable no-undef */
import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const CARS = [
	{
		brandTitle: 'Toyota Camry 2020',
		cover: require('../../assets/cars/blue-toyota-camry.jpg'),
		details:
			'À la fois flashy et pratique, la nouvelle Toyota Camry 2020 fait les gros titres.'
	},
	{
		brandTitle: 'PORSCHE CAYENNE TURBO GT 2023',
		cover: require('../../assets/cars/PORSCHE_CAYENNE_TURBO_GT_2023.png'),
		details:
			'Unleash the King of the Dunes: Rent a 2023 Porsche Cayenne Turbo GT and ...'
	},
	{
		brandTitle: 'BMW M4 2022',
		cover: require('../../assets/cars/BMW_M4_2022.png'),
		details:
			'2022 BMW M4, sculpted from a symphony of sleek lines and Bavarian engineering,...'
	}
];

export const CarDetailsScreen = () => {
	return (
		<View>
			<View style={{styles.topWrapper}}>
				<Icon name="arrow-left" size={40} color="#000" />
				{/* Car's brand */}
				<Title></Title>
			</View>
			<Image source={} />
			<View>
				<Title style={{styles.carDetailsHeader}}>Car Details</Title>

				{/* Car's details */}
				<View></View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({});

export default CarDetailsScreen;
