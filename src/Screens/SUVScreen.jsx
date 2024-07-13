/* eslint-disable react/prop-types */
// SUVScreen

import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	StatusBar,
	ScrollView
} from 'react-native';
import { Card } from 'react-native-paper';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

const SUVScreen = ({ navigation }) => {
	const [vehicles, setVehicles] = useState([]);

	useEffect(() => {
		const fetchVehicles = async () => {
			const querySnapshot = await getDocs(collection(db, 'vehicles'));
			if (querySnapshot.docs.length > 0) {
				try {
					const fetchedVehicles = querySnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data()
					}));
					const SUVs = fetchedVehicles.filter(
						(vehicle) => vehicle.type === 'Cross/SUV'
					);
					setVehicles(SUVs);
					// setFilteredVehicles(fetchedVehicles);
				} catch (error) {
					console.error(console.error());
				}
			}
		};

		fetchVehicles();
	}, []);
	const RenderCars = ({ item }) => {
		// Limit car details to maximum 20 words
		// const renderDetails = (details) => {
		// 	// Split the details into words
		// 	const words = details.split(' ');
		// 	// If the number of words exceeds 15, truncate and append ellipsis
		// 	if (words.length > 15) {
		// 		return words.slice(0, 15).join(' ') + '...';
		// 	} else {
		// 		return details + '...';
		// 	}
		// };

		return (
			<Card
				style={styles.contentCardWrapper}
				onPress={() =>
					navigation.navigate('CarDetails', {
						vehicle: item
					})
				}
			>
				<Card.Content style={styles.contentCardsContainer}>
					<Image
						source={{ uri: item.imageUrls[0] }}
						style={styles.contentCardsCover}
					/>
					<View style={styles.contentCardDetails}>
						<Text style={styles.vehicleBrand}>
							{item.brand} {item.model} {item.year}
						</Text>
						<Text style={styles.vehicleText}>{item.price} CFA/Jour</Text>
						{/* <Text numberOfLines={1} style={styles.vehicleText}>
							Details: {item.carDetails}
						</Text> */}
					</View>
				</Card.Content>
			</Card>
		);
	};
	return (
		<ScrollView>
			{vehicles.map((vehicle) => (
				<RenderCars key={vehicle.id} item={vehicle} />
			))}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: StatusBar.currentHeight || 0
	},
	contentCardWrapper: {
		marginVertical: 20
	},
	contentCardsContainer: {
		width: '100%'
	},
	contentCardsCover: {
		height: 300,
		borderRadius: 6
	},
	contentCardDetails: {
		justifyContent: 'space-around',
		width: '40%',
		marginLeft: 10
	},
	vehicleBrand: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	vehicleText: {
		fontSize: 16,
		fontWeight: 'bold'
	}
});

export default SUVScreen;
