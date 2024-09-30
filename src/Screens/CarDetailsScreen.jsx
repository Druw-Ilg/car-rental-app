/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	SafeAreaView,
	Linking,
	Platform,
	Image,
	ScrollView
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/MaterialCommunityIcons';
import { ImagesCaroussel } from '../components/UIComponents';
import { getCars } from '../utils/backendFunc';
import * as SecureStore from 'expo-secure-store';

const CarDetailsScreen = ({ route, navigation }) => {
	const [isLogedIn, setIsLogedIn] = useState(false);
	const { vehicle } = route.params;
	const [otherVehicles, setOtherVehicles] = useState([]);

	// get the user data from SecureStore session
	useEffect(() => {
		async function getUserData() {
			const user = await SecureStore.getItemAsync('user');

			if (user) {
				setIsLogedIn(true);
			} else {
				setIsLogedIn(false);
			}
		}
		getUserData();
	}, []);

	useEffect(() => {
		async function fetchData() {
			const fetchedVehicles = await getCars();
			const similarVehicles = fetchedVehicles.filter(
				(item) => item.type == vehicle.type && item.id !== vehicle.id
			);
			setOtherVehicles(similarVehicles);
		}
		fetchData();
	}, [vehicle]);

	const makePhoneCall = () => {
		if (Platform.OS == 'android') {
			Linking.openURL(`tel:${vehicle.vendorPhoneNumber}`);
		} else {
			Linking.openURL(`telprompt:${vehicle.vendorPhoneNumber}`);
		}
	};

	const RenderOtherVehicles = ({ item }) => {
		return (
			<TouchableOpacity
				style={styles.contentCardWrapper}
				onPress={() =>
					navigation.navigate('CarDetails', {
						vehicle: item
					})
				}
			>
				<Image
					source={{ uri: item.imageUrls[0] }}
					style={styles.contentCardsCover}
				/>
				<View>
					<Text style={styles.otherVehiclesBrand}>
						{item.brand} {item.model} {item.year}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View>
					{<ImagesCaroussel vehicle={vehicle} />}

					<Text style={styles.title}>
						{vehicle.brand} {vehicle.model} ({vehicle.year})
					</Text>
					<Text style={[styles.detailText, styles.price]}>
						{vehicle.price} CFA/Jour
					</Text>
				</View>

				<TouchableOpacity
					onPress={() => makePhoneCall()}
					style={styles.contactBtn}
				>
					<FontAwesome name="phone" size={30} color="#fff" />
				</TouchableOpacity>
				{isLogedIn && (
					<TouchableOpacity
						onPress={() => navigation.navigate('Booking', { vehicle })}
						style={styles.contactBtn}
					>
						<Text style={[styles.txtBtn, { color: '#fff', padding: 3 }]}>
							Book Now
						</Text>
					</TouchableOpacity>
				)}

				<View style={{ marginVertical: 20 }}>
					<Text style={styles.subtitle}>Ça pourrait aussi vous plaire...</Text>
					<ScrollView horizontal={true}>
						{otherVehicles.map((otherVehicle) => (
							<RenderOtherVehicles key={otherVehicle.id} item={otherVehicle} />
						))}
					</ScrollView>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	title: {
		fontSize: 24,
		padding: 12,
		fontWeight: 'bold'
	},
	txtBtn: {
		fontSize: 17,
		fontWeight: '600',
		paddingHorizontal: 12
	},
	subtitle: {
		fontSize: 20,
		fontWeight: '600',
		paddingHorizontal: 12
	},

	detailText: {
		fontSize: 18
	},
	price: {
		fontWeight: 'bold',
		paddingHorizontal: 12
	},

	contactBtn: {
		backgroundColor: 'rgb(40 52 74)',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 12,
		margin: 20,
		fontWeight: 'bold',
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 7
	},
	contentCardWrapper: {
		flex: 1,
		paddingHorizontal: 3,
		marginRight: 5
	},

	contentCardsCover: {
		width: 300,
		height: 200,
		borderRadius: 6
	},
	otherVehiclesBrand: {
		fontSize: 17,
		paddingHorizontal: 10
	}
});

export default CarDetailsScreen;
