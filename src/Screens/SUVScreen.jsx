import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	StatusBar,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import { Card } from 'react-native-paper';
import { doc, updateDoc, arrayUnion, arrayRemove, getDocs, collection, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';

const SUVScreen = ({ navigation }) => {
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
					const SUVs = fetchedVehicles.filter(
						(vehicle) => vehicle.type === 'Cross/SUV'
					);
					setVehicles(SUVs);
				} catch (error) {
					console.error(console.error());
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

	// Function to update the wishlist in Firestore
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
			console.log('No user is logged in');
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
							onPress={() => toggleWishlist(item.id)}
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

export default SUVScreen;
