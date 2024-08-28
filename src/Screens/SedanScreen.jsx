import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	Image,
	Alert,
	StyleSheet,
	StatusBar,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import { Card } from 'react-native-paper';

import {
	collection,
	getDocs,
	doc,
	getDoc,
	setDoc,
	arrayUnion,
	arrayRemove,
	updateDoc
} from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig';

const SedanScreen = ({ navigation }) => {
	const [vehicles, setVehicles] = useState([]);
	const [wishlist, setWishlist] = useState([]);

	useEffect(() => {
		const fetchVehicles = async () => {
			const querySnapshot = await getDocs(collection(db, 'vehicles'));
			if (querySnapshot.docs.length > 0) {
				try {
					const fetchedVehicles = querySnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data()
					}));
					const sedans = fetchedVehicles.filter(
						(vehicle) => vehicle.type === 'Berline/Sedan'
					);
					setVehicles(sedans);
				} catch (error) {
					console.error(error);
				}
			}
		};
		const fetchWishlist = async () => {
			const user = auth.currentUser;
			if (user) {
				const wishlistDocRef = doc(db, 'wishlist', user.uid);
				const wishlistDoc = await getDoc(wishlistDocRef);
				if (wishlistDoc.exists()) {
					setWishlist(wishlistDoc.data().vehicleID || []);
				} else {
					console.log('No wishlist found for the user.');
				}
			} else {
				console.log('No user is logged in.');
			}
		};

		fetchVehicles();
		fetchWishlist();
	}, []);

	const updateWishlistInFirestore = async (userId, vehicleId, add) => {
		try {
			const wishlistDocRef = doc(db, 'wishlist', userId); // Reference to the user's wishlist document

			if (add) {
				await setDoc(
					wishlistDocRef,
					{
						vehicleID: arrayUnion(vehicleId)
					},
					{ merge: true }
				);
			} else {
				await updateDoc(wishlistDocRef, {
					vehicleID: arrayRemove(vehicleId)
				});
			}
		} catch (error) {
			console.error('Error updating wishlist: ', error);
		}
	};

	const toggleWishlist = async (vehicleId) => {
		const user = auth.currentUser;

		if (user) {
			const userId = user.uid;

			setWishlist((prevWishlist) => {
				const isInWishlist = prevWishlist.includes(vehicleId);

				if (isInWishlist) {
					updateWishlistInFirestore(userId, vehicleId, false);
					return prevWishlist.filter((id) => id !== vehicleId);
				} else {
					updateWishlistInFirestore(userId, vehicleId, true);
					return [...prevWishlist, vehicleId];
				}
			});
		} else {
			Alert.alert('Please login first....');
		}
	};
	const RenderCars = ({ item }) => {
		const isInWishlist = wishlist.includes(item.id);

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
						<TouchableOpacity
							style={styles.wishlistButton}
							onPress={() => toggleWishlist(item.id)} // Handle wishlist toggle
						>
							<Image
								source={
									isInWishlist
										? require('../../assets/heart-filled.png')
										: require('../../assets/heart.png')
								}
								style={styles.wishlistIcon}
							/>
						</TouchableOpacity>
					</View>
				</Card.Content>
			</Card>
		);
	};

	return (
		<ScrollView style={styles.container}>
			{vehicles.map((vehicle) => (
				<RenderCars key={vehicle.id} item={vehicle} />
			))}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	blueWrapper: {
		backgroundColor: 'rgb(40 52 74)',
		alignItems: 'center',
		marginBottom: 100
	},

	searchBar: {
		width: '80%',
		backgroundColor: 'transparent',
		marginTop: 30,
		marginBottom: 30,
		borderColor: '#f2f2f3',
		borderBottomWidth: 1,
		borderRadius: 0,
		opacity: 0.6
	},
	headerText: {
		color: '#f3f3f3',
		fontSize: 30,
		textAlign: 'center'
	},
	imgBoxHeaderWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
		marginTop: 80,
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
	sectionPopulaire: {
		padding: 10
	},
	sectionPopulaireTitles: {
		flexDirection: 'row',
		justifyContent: 'space-between'
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
		backgroundColor: '#fff'
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
		width: '100%',
		marginLeft: 10
	},
	vehicleBrand: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	vehicleText: {
		fontSize: 16,
		fontWeight: 'bold'
	},

	wishlistButton: {
		position: 'absolute',
		bottom: 0,
		right: 20,
		backgroundColor: '#fff',
		borderRadius: 50,
		padding: 10,
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84
	},
	wishlistIcon: {
		width: 20,
		height: 20,
		tintColor: '#e74c3c'
	}
});

export default SedanScreen;
