/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	ScrollView,
	Image,
	TouchableOpacity
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as SecureStore from 'expo-secure-store';
import FontAwesome from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth,db, } from '../../../firebase/firebaseConfig';
import {
	collection,
	getDoc,
	getDocs,
	query,
	where,
	doc,
	updateDoc
} from 'firebase/firestore';
import UserProfile from './UserProfile';

const Tab = createMaterialTopTabNavigator();

const ProfileTab = ({ user }) => {
	const [name, setName] = useState(user?.name || '');
	const [email, setEmail] = useState(user?.email || '');
	const [phone, setPhone] = useState(user?.phone || '');
	const [isVendor, setIsVendor] = useState(user?.isVendor || false);

	const handleSave = async () => {
		try {
			const userDocRef = doc(db, 'users', user.id);
			await updateDoc(userDocRef, {
				name,
				email,
				phone,
				isVendor
			});
			alert('Profile updated successfully!');
		} catch (error) {
			console.error('Error updating profile: ', error);
		}
	};

	return (
		<UserProfile/>
	);
};

const WishlistTab = ({ user }) => {
	const [wishlist, setWishlist] = useState([]);
	const [vehicleDetails, setVehicleDetails] = useState([]);

	useEffect(() => {
		const fetchWishlist = async () => {
			try {
				const user = auth.currentUser;
				if (user) {
					const wishlistDocRef = doc(db, 'wishlist', user.uid);
					const wishlistDoc = await getDoc(wishlistDocRef);
					if (wishlistDoc.exists()) {
						const wishlistIds = wishlistDoc.data().vehicleID || [];
						setWishlist(wishlistIds);

						// Fetch the details for each vehicle in the wishlist
						const vehiclePromises = wishlistIds.map(async (vehicleId) => {
							const vehicleDoc = await getDoc(doc(db, 'vehicles', vehicleId));
							if (vehicleDoc.exists()) {
								return { id: vehicleDoc.id, ...vehicleDoc.data() };
							}
							return null;
						});

						// Wait for all vehicle details to be fetched
						const vehicles = await Promise.all(vehiclePromises);
						setVehicleDetails(vehicles.filter((vehicle) => vehicle !== null));
					} else {
						console.log('No wishlist found for the user.');
					}
				} else {
					console.log('No user is logged in.');
				}
			} catch (error) {
				console.error('Error fetching wishlist: ', error);
			}
		};

		fetchWishlist();
	}, []);
	const handleRemove = (index) => {
		// Logic to remove item from wishlist
		console.log(`Removing vehicle at index: ${index}`);
	  };
	return (
		<ScrollView contentContainerStyle={styles.container}>
		{vehicleDetails.length > 0 ? (
		  vehicleDetails.map((vehicle, index) => (
			<View key={index} style={styles.wishlistItem}>
			  <Image source={{ uri: vehicle.imageUrls[0] }} style={styles.vehicleImage} />
			  <View style={styles.vehicleDetails}>
				<View><Text style={styles.vehicleName}>{vehicle.brand} {vehicle.model}</Text>
				<Text style={styles.vehiclePrice}>Price: {vehicle.price} CFA/Jour</Text>
				<TouchableOpacity  style={styles.removeButton}>
				<Text style={styles.vehiclePrice}>Availability</Text>
				</TouchableOpacity>
				</View>
				<View>
				<TouchableOpacity onPress={() => handleRemove(index)} style={styles.removeButton}>
				<FontAwesome name="heart" size={30} color="#000" />
				</TouchableOpacity>
					<TouchableOpacity onPress={() => handleRemove(index)} style={styles.removeButton}>
				<FontAwesome name="delete" size={30} color="#000" />
				</TouchableOpacity>

				</View>
			  </View>
			</View>
		  ))
		) : (
		  <Text style={{ textAlign: 'center' }}>Aucun Favoris</Text>
		)}
	  </ScrollView>
	);
};


const UserProfileScreen = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const loadUser = async () => {
			try {
				const userStr = await SecureStore.getItemAsync('user');
				if (userStr) {
					const userObj = JSON.parse(userStr);
					setUser(userObj);
				}
			} catch (error) {
				console.error('Error loading user from SecureStore', error);
			}
		};

		loadUser();
	}, []);

	if (!user) {
		return (
			<View style={styles.container}>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<Tab.Navigator>
			<Tab.Screen name="Profile">{() => <ProfileTab user={user} />}</Tab.Screen>
			<Tab.Screen name="Wishlist">
				{() => <WishlistTab user={user} />}
			</Tab.Screen>
		</Tab.Navigator>
	);
};

const styles = StyleSheet.create({
		container: {
		
		  backgroundColor: '#FFF',
		},
		wishlistItem: {
		  flexDirection: 'col',
		  padding:10,
		  backgroundColor:'red',
		  justifyContent:'space-between'
		
		},
		vehicleImage: {
		  width: '100%',
		  height:150,
		  borderRadius: 10,
		  objectFit:'cover',
		  
		},
		vehicleDetails: {
		 width:'100%',
		  flexDirection:'row',
		    backgroundColor:'yellow',
		 justifyContent:'space-between'	
		},
		vehicleName: {
		  fontSize: 18,
		  fontWeight: 'bold',
		  marginBottom: 5,
		},
		vehiclePrice: {
		  fontSize: 16,
		  color: '#888',
		  marginBottom: 10,
		},
		removeButton: {
		  paddingVertical: 14,
		  paddingHorizontal: 10,
		  borderRadius: 8,
		},
		removeButtonText: {
		  color: '#000',
		  fontSize: 15,
		  fontWeight:'500'
		},
	  
	
});

export default UserProfileScreen;
