import React, { useState, useEffect, useContext } from 'react';
import { Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import { AuthContext } from '../../utils/AuthContext';

const VendorProfileScreen = () => {
	const { userData } = useContext(AuthContext);
	const [vendorInfo, setVendorInfo] = useState({
		name: '',
		phoneNumber: '',
		email: ''
	});

	useEffect(() => {
		const fetchVendorInfo = async () => {
			try {
				const docRef = doc(db, 'users', userData.uid);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					setVendorInfo(docSnap.data());
				} else {
					console.log('No such document!');
				}
			} catch (error) {
				console.error('Error fetching vendor info: ', error);
			}
		};

		fetchVendorInfo();
	}, []);

	const handleUpdate = async () => {
		try {
			const docRef = doc(db, 'users', userData.uid);
			await updateDoc(docRef, vendorInfo);
			alert('Profile updated successfully!');
		} catch (error) {
			console.error('Error updating profile: ', error);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Vendor Profile</Text>
			<TextInput
				style={styles.input}
				value={vendorInfo.name}
				onChangeText={(text) => setVendorInfo({ ...vendorInfo, name: text })}
				placeholder="Name/Company Name"
			/>
			<TextInput
				style={styles.input}
				value={vendorInfo.phoneNumber}
				onChangeText={(text) =>
					setVendorInfo({ ...vendorInfo, phoneNumber: text })
				}
				placeholder="Phone Number"
				keyboardType="phone-pad"
			/>
			<TextInput
				style={styles.input}
				value={vendorInfo.email}
				onChangeText={(text) => setVendorInfo({ ...vendorInfo, email: text })}
				placeholder="Email"
				keyboardType="email-address"
				editable={false} // Assuming email is not editable
			/>
			<Button title="Update Profile" onPress={handleUpdate} />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: 20,
		backgroundColor: '#fff'
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center'
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		borderRadius: 5,
		marginBottom: 10
	}
});

export default VendorProfileScreen;
