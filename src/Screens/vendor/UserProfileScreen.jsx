/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	ScrollView
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as SecureStore from 'expo-secure-store';
import { db } from '../../../firebase/firebaseConfig';
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	updateDoc
} from 'firebase/firestore';

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
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.label}>Name</Text>
			<TextInput style={styles.input} value={name} onChangeText={setName} />
			<Text style={styles.label}>Email</Text>
			<TextInput style={styles.input} value={email} onChangeText={setEmail} />
			{isVendor && (
				<>
					<Text style={styles.label}>Phone</Text>
					<TextInput
						style={styles.input}
						value={phone}
						onChangeText={setPhone}
					/>
				</>
			)}
			<Button title="Mettre à jour" onPress={handleSave} />
		</ScrollView>
	);
};

const WishlistTab = ({ user }) => {
	const [wishlist, setWishlist] = useState([]);

	useEffect(() => {
		const fetchWishlist = async () => {
			try {
				const q = query(
					collection(db, 'wishlist'),
					where('userId', '==', user.uid)
				);
				const querySnapshot = await getDocs(q);
				const fetchedWishlist = querySnapshot.docs.map((doc) => doc.data());
				setWishlist(fetchedWishlist);
			} catch (error) {
				console.error('Error fetching wishlist: ', error);
			}
		};

		fetchWishlist();
	}, []);

	return (
		<ScrollView contentContainerStyle={styles.container}>
			{wishlist.length > 0 ? (
				wishlist.map((item, index) => (
					<View key={index} style={styles.wishlistItem}>
						<Text>{item.vehicleName}</Text>
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
		flex: 1,
		padding: 20
	},
	label: {
		fontSize: 16,
		marginBottom: 10
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		marginBottom: 20
	},
	wishlistItem: {
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc'
	}
});

export default UserProfileScreen;
