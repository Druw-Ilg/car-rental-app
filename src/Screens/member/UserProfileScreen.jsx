/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect ,useContext} from 'react';
import UserBookings from '..//UserBookings'
import BookingRequests from '../vendor/BookingRequests';
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	ScrollView,
	Image,
	TouchableOpacity,
	ActivityIndicator,
	FlatList
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as SecureStore from 'expo-secure-store';
import FontAwesome from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth,db, } from '../../../firebase/firebaseConfig';
import { AuthContext } from '../../utils/AuthContext';
import {
	collection,
	onSnapshot,
	getDoc,
	query,
	setDoc,
	doc,
	updateDoc,
	where,
	getDocs,
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
					const vehicleData = { id: vehicleDoc.id, ...vehicleDoc.data() };
	  
					// Listen to booking status changes in real-time
					const bookingQueryRef = query(
					  collection(db, 'booking'),
					  where('vehicleID', '==', vehicleId)
					);
	  
					onSnapshot(bookingQueryRef, (bookingSnapshot) => {
					  let bookingStatus = 'Available';
					  if (!bookingSnapshot.empty) {
						const bookingData = bookingSnapshot.docs[0].data();
						bookingStatus = bookingData.bookingStatus || 'Available';
					  }
	  
					  // Update the vehicle details with the booking status
					  setVehicleDetails((prevVehicleDetails) => {
						return prevVehicleDetails.map((vehicle) => 
						  vehicle.id === vehicleId ? { ...vehicle, bookingStatus } : vehicle
						);
					  });
					});
	  
					// Return the initial vehicle data, real-time updates will modify it later
					return { ...vehicleData, bookingStatus: 'Available' }; 
				  }
				  return null;
				});
	  
				// Wait for all vehicle details to be fetched initially
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
	  
	  
	const handleRemove = async (index) => {
		try {
		  const user = auth.currentUser;
		  if (user) {
			const vehicleIdToRemove = vehicleDetails[index].id;
	
			// Remove vehicle from the local state
			setVehicleDetails(vehicleDetails.filter((_, i) => i !== index));
	
			// Update the wishlist in Firestore
			const wishlistDocRef = doc(db, 'wishlist', user.uid);
			const wishlistDoc = await getDoc(wishlistDocRef);
			if (wishlistDoc.exists()) {
			  const wishlistData = wishlistDoc.data();
			  const updatedWishlist = wishlistData.vehicleID.filter(id => id !== vehicleIdToRemove);
	
			  // Update the Firestore document
			  await setDoc(wishlistDocRef, { vehicleID: updatedWishlist }, { merge: true });
			}
		  } else {
			console.log('No user is logged in.');
		  }
		} catch (error) {
		  console.error('Error removing vehicle from wishlist: ', error);
		}
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
				<Text style={{ color: 'blue' }}>
                {vehicle.bookingStatus === 'accepted' ? 'Busy' : 'Available'}
              </Text>
				</TouchableOpacity>
				</View>
				<View>
				<TouchableOpacity disabled style={styles.removeButton}>
				<Image source={require('..//..//../assets/heart-filled.png')} style={{width:30,height:30}}/>
				</TouchableOpacity>
					<TouchableOpacity onPress={() => handleRemove(index)} style={styles.removeButton}>
				<Image source={require('..//..//../assets/delete.png')} style={{width:30,height:30}}/>
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
	const Bookings = () => {
		const [bookings, setBookings] = useState([]);
		const [loading, setLoading] = useState(true);
		const {userData} = useContext(AuthContext)
	    const [avatar, setAvatar] = useState(null);

		const fetchBookings = async () => {
		  try {
		  
	  
	  
			const bookingsRef = collection(db, 'booking'); // Reference to the 'bookings' collection
			
			// Use query to fetch bookings where customerID equals the current user's UID
			const bookingsQuery = query(bookingsRef, where('customerID', '==', userData.uid));
	  
			const querySnapshot = await getDocs(bookingsQuery); // Fetch matching documents
	  
			const bookingsData = querySnapshot.docs.map((doc) => ({
			  id: doc.id,
			  ...doc.data(),
			}));
	      
			setBookings(bookingsData);
			setLoading(false);
		  } catch (error) {
			console.error('Error fetching bookings: ', error);
			setLoading(false);
		  }
		};
		const fetchAvatar = async () => {
			try {
			 
			  const avatarRef = collection(db, 'avatar'); 
			  const avatarQuery = query(avatarRef, where('userId', '==', userData.uid));
		
			  const avatarSnapshot = await getDocs(avatarQuery); 
		
			  if (!avatarSnapshot.empty) {
				const avatarData = avatarSnapshot.docs[0].data();
				setAvatar(avatarData.downloadUrl); 
			  } else {
				console.log('No avatar found for this user');
			  }
			} catch (error) {
			  console.error('Error fetching avatar: ', error);
			}
		  };
	  
		useEffect(() => {
		  fetchBookings();
		  fetchAvatar();
		}, []);
	  
		if (loading) {
		  return <ActivityIndicator size="large" color="#0000ff" />;
		}
		const formatBookingDate = (bookingDate) => {
			const date = new Date(bookingDate);
			return date.toLocaleDateString('en-US', {
			  year: 'numeric',
			  month: 'long',
			  day: 'numeric',
			});
		  };
		
		  return (
			<ScrollView contentContainerStyle={styles.container}>
			  <Text style={styles.header}>Your Bookings</Text>
			  
				{bookings && bookings.map((booking) => (
				  <View key={booking.id} style={styles.CardContainer}>
					<View style={styles.cardItems}>
					  <Text style={styles.dateFromTo}>{`${booking.startDate} - ${booking.endDate}`}</Text>
					</View>
					<View style={[styles.cardItems, { marginBottom: 7 }]}>
					  <View style={{ flex: 0.6, justifyContent: 'flex-start', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
						
						  <Image source={{ uri:avatar }} style={styles.profileImage} />
						
						<Text style={styles.personName}>{booking.fullName}</Text>
					  </View>
		
					  {booking.bookingStatus === "rejected"?
						<TouchableOpacity style={[styles.viewDetialsButton, { backgroundColor: '#fa6055', marginHorizontal: 'auto' }]} disabled>
						  <Text style={{ color: '#fff' }}>Rejected</Text>
						</TouchableOpacity>:null}
						
						{booking.bookingStatus === "accepted"?
						<TouchableOpacity style={[styles.viewDetialsButton, { backgroundColor: '#50b379', marginHorizontal: 'auto' }]} disabled>
						  <Text style={{ color: '#fff' }}>Accepted</Text>
						</TouchableOpacity>:null}
						{booking.bookingStatus === "pending"?
						<TouchableOpacity style={[styles.viewDetialsButton, { backgroundColor: '#9ea192', marginHorizontal: 'auto' }]} disabled>
						  <Text style={{ color: '#fff' }}>Pending</Text>
						</TouchableOpacity>:null}
					</View>
					<Text style={styles.dateFromTo}>Request Sent on {formatBookingDate(booking.bookingDate)}</Text>
				  </View>
				)
			  )}
			</ScrollView>
		  );
		};

	return (
		<Tab.Navigator >
			<Tab.Screen name="Bookings History" >{()=><Bookings/>}</Tab.Screen>
			<Tab.Screen name="Wishlist">
				{() => <WishlistTab user={user} />}
			</Tab.Screen>
			<Tab.Screen name="Profile">
				{() => <ProfileTab user={user} />}
			</Tab.Screen>
		</Tab.Navigator>
	);
};

const styles = StyleSheet.create({
		container: {
		
		  backgroundColor: '#f5f5f5 Profile',
		},
		wishlistItem: {
		  flexDirection: 'col',
		  padding:10,
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
		justifyContent:'space-between',
		paddingVertical: 14,
		paddingHorizontal: 10,	
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
		 marginBottom:10,
		},
		removeButtonText: {
		  color: '#000',
		  fontSize: 15,
		  fontWeight:'500'
		},
		header: {
			fontWeight: 'bold',
			fontSize: 25,
			marginBottom: 20,
		  },
		  CardContainer: {
			padding: 10,
			backgroundColor: '#f9f9f9',
			borderRadius: 10,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 5,
			marginBottom: 15,
		  },
		  cardItems: {
			justifyContent: 'space-between',
			flexDirection: 'row',
			marginBottom: 20,
		  },
		  viewDetialsButton: {
			paddingHorizontal: 20,
			paddingVertical: 5,
			borderRadius: 20,
			backgroundColor: '#ebeced',
		  },
		  dateFromTo: {
			fontSize: 14,
			color: '#a8aaad',
		  },
		  profileImage: {
			width: 30,
			height: 30,
			borderRadius: 20,
		  },
		  personName: {
			fontWeight: 'bold',
			fontSize: 13,
			marginHorizontal: 3,
		  },
	
});

export default UserProfileScreen;
