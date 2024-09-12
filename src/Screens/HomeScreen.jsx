/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StyleSheet,
	Image,
	ScrollView,
	StatusBar,
} from 'react-native';
import { Searchbar, Card, Title } from 'react-native-paper';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native';

const CustomSearchIcon = () => (
	<View style={{ marginRight: 10 }}>
		<Icon name="magnify" size={40} color="white" />
	</View>
);

const HomeScreen = ({ navigation }) => {
	const [vehicles, setVehicles] = useState([]);
	const [filteredVehicles, setFilteredVehicles] = useState([]);
	const [search, setSearch] = useState('');

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
						
						<Icon name="arrow-right" size={40} color="#000" />
					</View>
					</View>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View style={styles.blueWrapper}>
					<Header navigation={navigation} />

					<Searchbar
						style={styles.searchBar}
						placeholder="Une marque ou un modèle de véhicule.."
					    onPress={() =>navigation.navigate('search')}
						placeholderTextColor="#fff"
						inputStyle={{ color: 'white' }}
						icon={() => <CustomSearchIcon />}
					/>

					{/* Welcome text */}
					<Text style={styles.headerText}>
						Louer un véhicule n&apos;a jamais été aussi facile.
					</Text>

					{/* Cards at the bottom */}
					<View style={styles.imgBoxHeaderWrapper}>
						<Card
							style={styles.imgCardHeader}
							onPress={() => navigation.navigate('Sedan')}
						>
							<Card.Content>
								<Image
									// eslint-disable-next-line no-undef
									source={require('../../assets/blue-sedan.jpg')}
									style={styles.cardImageHeader}
								/>
								<Title style={styles.carTypes}>Berline/Sedan</Title>
							</Card.Content>
						</Card>

						<Card
							style={styles.imgCardHeader}
							onPress={() => navigation.navigate('SUV')}
						>
							<Card.Content>
								<Image
									// eslint-disable-next-line no-undef
									source={require('../../assets/blue-suv.jpg')}
									style={styles.cardImageHeader}
								/>
								<Title style={styles.carTypes}>Cross/SUV</Title>
							</Card.Content>
						</Card>
					</View>
				</View>
				
				<View>
				{vehicles && vehicles.length > 0 ? (
  vehicles.map((vehicle) => (
    <RenderCars key={vehicle.id} item={vehicle} />
  ))
) : (
  <ActivityIndicator color="blue"/>
)}

				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: StatusBar.currentHeight || 0,
		backgroundColor:'#fff'
	},
	blueWrapper: {
		backgroundColor: 'rgb(40 52 74)',
		alignItems: 'center',
		marginBottom: 100
	},

	searchBar: {
		width: '90%',
		backgroundColor: 'transparent',
		marginTop: 20,
		marginBottom: 30,
		borderColor: '#f2f2f3',
		borderBottomWidth: 1,
		borderRadius: 32,
		opacity: 0.6
	},
	headerText: {
		color: '#f3f3f3',
		fontSize: 27,
		textAlign: 'center'
	},
	imgBoxHeaderWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
		marginTop: 40,
		marginBottom: -70
	},
	imgCardHeader: {
		width: '45%',
		margin: 5,
		padding: 5,
		backgroundColor: 'white'
	},
	cardImageHeader: {
		width: '100%',
		height: 85,
		resizeMode: 'contain',
		marginBottom: 10
	},
	carTypes: {
		textAlign: 'center'
	},

	titleSection: {
		fontWeight: '800',
		fontSize: 26,
		textDecorationLine: 'underline',
		color: 'rgb(40 52 74)'
	},
	subTitleSection: {
		fontSize: 20,
		fontWeight: 400,
		color: 'rgb(40 52 74)'
	},
	contentCardWrapper: {
		marginVertical: 20,
		marginHorizontal:10,
		borderRadius:14,
		backgroundColor:'#f5f5f5',
	},
	contentCardsContainer: {
		width: '100%',
		flexDirection: 'row',
		padding:7,
	},
	contentCardsCover: {
		width: '60%',
		height: 150,
		borderRadius:12,
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

export default HomeScreen;
