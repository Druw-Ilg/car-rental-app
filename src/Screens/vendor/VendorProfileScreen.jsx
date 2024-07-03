import React, { useState, useEffect, useContext } from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	Image,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
	TouchableOpacity
} from 'react-native';
import {
	addDoc,
	collection,
	getDocs,
	query,
	updateDoc,
	where
} from 'firebase/firestore';
import { db, storage } from '../../../firebase/firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

import { AuthContext } from '../../utils/AuthContext';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

const alertMsg = (type, msg) => {
	return (
		<>
			{type == 'success' ? (
				<Text style={[styles.successMessage, styles.alertMsg]}>
					{msg} <Ionicons name="checkmark-circle" size={30} color="green" />
				</Text>
			) : (
				<Text style={[styles.errorMessage, styles.alertMsg]}>
					{msg} <Entypo name="squared-cross" size={30} color="red" />
				</Text>
			)}
		</>
	);
};

const VendorProfileScreen = () => {
	const [loading, setLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const { userData } = useContext(AuthContext);
	const [avatar, setAvatar] = useState(null);
	// const [image, setImage] = useState(null);
	const [vendorInfo, setVendorInfo] = useState({
		name: '',
		phoneNumber: '',
		email: ''
	});

	// get user's document
	const userDoc = async () => {
		const q = query(
			collection(db, 'users'),
			where('email', '==', userData.email)
		);
		const docSnap = await getDocs(q);
		return docSnap;
	};

	const fetchAvatar = async () => {
		setLoading(true);
		if (userData) {
			const q = query(
				collection(db, 'avatar'),
				where('userId', '==', userData.uid)
			);
			const querySnapshot = await getDocs(q);
			if (querySnapshot.docs.length > 0) {
				try {
					setAvatar(querySnapshot.docs[0].data());
				} catch (error) {
					console.error(error);
				}
			}
		}
		setLoading(false);
	};

	useEffect(() => {
		const fetchVendorInfo = async () => {
			try {
				const info = (await userDoc()).docs[0]?.data();
				setVendorInfo({
					name: info.name,
					phoneNumber: info.phoneNumber,
					email: info.email
				});
			} catch (error) {
				console.error("Couldn't update info: ", error);
			}
		};

		fetchVendorInfo();
		fetchAvatar();
	}, []);

	const handleUpdate = async () => {
		try {
			setLoading(true);
			// const docRef = (await userDoc()).docs[0].ref;

			await updateDoc(docRef, {
				name: vendorInfo.name,
				phoneNumber: vendorInfo.phoneNumber
			});
			setErrorMessage('');
			setSuccessMessage(
				alertMsg('success', 'Information mise à jour avec succès!')
			);
			setLoading(false);
		} catch (error) {
			setSuccessMessage('');
			setErrorMessage(
				alertMsg('error', 'Impossible de mettre vos informations à jour!')
			);
			setLoading(false);
			console.error('Error updating profile: ', error);
		}
	};
	const changeAvatar = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				aspect: [4, 3],
				allowsEditing: true,
				quality: 1
			});

			if (!result.canceled) {
				uploadAvatar(result.assets[0].uri);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const uploadAvatar = async (image) => {
		if (image && userData) {
			try {
				const response = await fetch(image);
				const blob = await response.blob();
				const storageRef = ref(storage, `avatar/${userData.uid}/${Date.now()}`);
				await uploadBytesResumable(storageRef, blob);

				const downloadUrl = await getDownloadURL(storageRef);

				try {
					await addDoc(collection(db, 'avatar'), {
						userId: userData.uid,
						downloadUrl
					});
				} catch (error) {
					console.error(error);
				}
				console.log('success');
			} catch (error) {
				console.error(error);
			}
			fetchAvatar();
		} else {
			console.error('There was an error!', image);
		}
	};
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.avatar}>
				{avatar ? (
					<Image
						source={{ uri: avatar.downloadUrl }}
						style={styles.avatarImage}
					/>
				) : (
					<EvilIcons name="user" size={170} color="#d3d3d3" />
				)}

				<TouchableOpacity onPress={changeAvatar}>
					<Text>
						Modifier votre avatar
						<EvilIcons name="pencil" size={30} color="#000" />
					</Text>
				</TouchableOpacity>
			</View>

			{/* ******* Alert Messages ******* */}
			<View>
				{successMessage}

				{errorMessage}
			</View>

			{/* ******* Alert Messages ******* */}

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
				editable={false} // email is not editable
			/>
			{!loading ? (
				<Button title="Update Profile" onPress={handleUpdate} />
			) : (
				<ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: 20,
		backgroundColor: '#fff'
	},
	avatar: {
		alignItems: 'center',
		marginBottom: 50
	},
	avatarImage: {
		width: 150,
		height: 150,
		borderRadius: 100
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
	},
	alertMsg: {
		textAlign: 'center',
		fontSize: 18
	},
	errorMessage: {
		color: 'red'
	},
	successMessage: {
		color: 'green'
	}
});

export default VendorProfileScreen;
