/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	ActivityIndicator,
	TouchableOpacity,
	Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { Searchbar } from 'react-native-paper';

// const CustomSearchIcon = () => (
// 	<View style={{ marginRight: 10 }}>
// 		<Icon name="magnify" size={30} color="#050505" />
// 	</View>
// );

function SearchScreen({ navigation }) {
	const [search, setSearch] = useState('');
	const [filteredVehicles, setFilteredVehicles] = useState([]);
	const [vehicles, setVehicles] = useState([]);

	const fetchVehicles = async () => {
		const querySnapshot = await getDocs(collection(db, 'vehicles'));
		if (querySnapshot.docs.length > 0) {
			try {
				const fetchedVehicles = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data()
				}));
				setVehicles(fetchedVehicles);
				// setFilteredVehicles(fetchedVehicles);
			} catch (error) {
				console.error(console.error());
			}
		} else {
			return (
				<Text style={{ textAlign: 'center' }}>
					Pas de véhicule disponible pour le moment.
				</Text>
			);
		}
	};
	useEffect(() => {
		fetchVehicles();
		const intervalId = setInterval(fetchVehicles, 30000); // Fetch every 30 seconds

		return () => clearInterval(intervalId); // Clear interval on unmount
	}, []);

	useEffect(() => {
		const filtered = vehicles.filter(
			(vehicle) =>
				vehicle.brand.toLowerCase().includes(search.toLowerCase()) ||
				vehicle.model.toLowerCase().includes(search.toLowerCase())
		);
		setFilteredVehicles(filtered);
	}, [search, vehicles]);

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
			<TouchableOpacity
				style={styles.contentCardWrapper}
				onPress={() =>
					navigation.navigate('CarDetails', {
						vehicle: item
					})
				}
			>
				<View style={styles.contentCardsContainer}>
					<Image
						source={{ uri: item.imageUrls[0] }}
						style={styles.contentCardsCover}
					/>
					<View style={styles.contentCardDetails}>
						<Text style={styles.vehicleBrand}>
							{item.brand} {item.model} ({item.year})
						</Text>
						<Text style={styles.vehicleText}>{item.price} CFA/Jour</Text>
						{/* <Text numberOfLines={1} style={styles.vehicleText}>
							Details: {item.carDetails}
						</Text> */}
						<Icon name="arrow-right" size={40} color="#000" />
					</View>
				</View>
			</TouchableOpacity>
		);
	};
	return (
		<SafeAreaView style={styles.wrapper}>
			<ScrollView>
				<View style={styles.searchBarWrapper}>
					<Searchbar
						placeholder="Une marque ou un modèle de véhicule..."
						onChangeText={setSearch}
						value={search}
						placeholderTextColor="#010101"
						inputStyle={{
							color: '#010101',
							fontSize: 14,
							minHeight: 18,
							lineHeight: 17
						}}
						style={styles.searchBar}
						autoFocus={true}
					/>
				</View>

				<View>
					{filteredVehicles.length > 0 ? (
						filteredVehicles.map((vehicle) => (
							<RenderCars key={vehicle.id} item={vehicle} />
						))
					) : vehicles.length > 0 ? (
						vehicles.map((vehicle) => (
							<RenderCars key={vehicle.id} item={vehicle} />
						))
					) : (
						<ActivityIndicator
							size="large"
							color="#0000ff"
							style={styles.loader}
						/>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: '#fff'
	},
	searchBarWrapper: {
		alignItems: 'center',
		marginTop: 10
	},
	searchBar: {
		width: '90%',
		backgroundColor: '#f5f5f5',
		marginBottom: 30,
		paddingHorizontal: 3,
		borderColor: '#020203',
		borderWidth: 1,
		borderRadius: 32,
		opacity: 0.6
	},
	contentCardWrapper: {
		marginVertical: 20,
		marginHorizontal: 10,
		borderRadius: 14,
		backgroundColor: '#f5f5f5'
	},
	contentCardsContainer: {
		width: '100%',
		flexDirection: 'row',

		padding: 7
	},
	contentCardsCover: {
		width: '60%',
		height: 150,
		borderRadius: 12
	},
	contentCardDetails: {
		justifyContent: 'space-around',
		width: '40%',
		marginLeft: 3
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

export default SearchScreen;
