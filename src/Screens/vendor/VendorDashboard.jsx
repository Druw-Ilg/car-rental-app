import React, { useState, useEffect, useContext } from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	Image,
	StyleSheet,
	TouchableOpacity,
	StatusBar,
	ActivityIndicator,
	ScrollView
} from 'react-native';
import { Card } from 'react-native-paper';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../utils/AuthContext';
import { db, storage } from '../../../firebase/firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Collapsible from 'react-native-collapsible';

const VendorDashboard = () => {
	const [loading, setLoading] = useState(false);

	const { userData } = useContext(AuthContext);
	const [vehicles, setVehicles] = useState([]);
	const [vehicleData, setVehicleData] = useState({
		brand: '',
		model: '',
		year: '',
		price: ''
	});
	const [images, setImages] = useState([]);
	const [isCollapsed, setIsCollapsed] = useState(true);
	const [cameraPermission, setCameraPermission] =
		ImagePicker.useCameraPermissions();

	const [galleryPermission, setGalleryPermission] =
		ImagePicker.useMediaLibraryPermissions();

	const fetchVehicles = async () => {
		setLoading(true);
		if (userData) {
			const q = query(
				collection(db, 'vehicles'),
				where('vendorId', '==', userData.uid)
			);
			const querySnapshot = await getDocs(q);
			if (querySnapshot.docs.length > 0) {
				try {
					querySnapshot.docs.forEach((doc) =>
						setVehicles([{ ...doc.data(), id: doc.id }])
					);
				} catch (error) {
					console.error(error);
				}
			}
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchVehicles();
	}, []);

	// const takePhoto = async () => {
	// 	// handle camera permission
	// 	if (cameraPermission?.status === ImagePicker.PermissionStatus.GRANTED) {
	// 		try {
	// 			const cameraResp = await ImagePicker.launchCameraAsync({
	// 				mediaTypes: ImagePicker.MediaTypeOptions.Images,
	// 				allowsEditing: true,
	// 				aspect: [4, 3],
	// 				quality: 1
	// 			});

	// 			if (!cameraResp.canceled) {
	// 				setImages(cameraResp.assets[0]);

	// 				console.log(cameraResp.assets[0].uri);
	// 			}
	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 	} else {
	// 		console.error(`Permission not granted!`);
	// 	}
	// };

	const handleInputChange = (name, value) => {
		setVehicleData({ ...vehicleData, [name]: value });
	};

	const pickImages = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				aspect: [4, 3],
				allowsMultipleSelection: true,
				quality: 1
			});

			if (!result.cancelled) {
				setImages(result.assets.map((asset) => ('uri: ', asset.uri)));
			}
		} catch (error) {
			console.log(error);
		}
	};

	const uploadVehicle = async () => {
		if (images.length > 0 && userData) {
			try {
				const imageUrls = await Promise.all(
					images.map(async (imageUri) => {
						const response = await fetch(imageUri);
						const blob = await response.blob();
						const storageRef = ref(
							storage,
							`vehicles/${userData.uid}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
						);
						await uploadBytesResumable(storageRef, blob);
						// console.log('l 124: ', uploadTask);
						// uploadTask.on(
						// 	'state_changed',
						// 	(snapshot) => {
						// 		// Handle progress
						// 		const progress =
						// 			(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						// 		console.log('Upload is ' + progress + '% done');
						// 	},
						// 	(error) => {
						// 		console.error(error);
						// 		reject(error);
						// 	},
						// 	async () => {
						// 		let dURL;
						// 		// Upload completed successfully, now we can get the download URL
						// 		await getDownloadURL(uploadTask.snapshot.ref).then(
						// 			(downloadURL) => {
						// 				dURL = downloadURL;
						// 			}
						// 		);
						// 		resolve({
						// 			dURL,
						// 			metadata: uploadTask.snapshot.metadata
						// 		});
						// 	}
						// );
						return await getDownloadURL(storageRef);
					})
				);

				try {
					const vehicle = await addDoc(collection(db, 'vehicles'), {
						...vehicleData,
						vendorId: userData.uid,
						imageUrls
					});
					if (vehicle) {
						setVehicleData({
							brand: '',
							model: '',
							year: '',
							price: ''
						});
						setImages([]);
						fetchVehicles();
					}
				} catch (error) {
					console.error(error);
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			alert('Please select an image and fill all the fields');
			console.log(`User Data: ${userData} ------ Image: ${images}`);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.title}>Vendor Dashboard</Text>

			{/* add new vehicle dropdown */}
			<TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={styles.subtitle}>Add New Vehicle</Text>

					<Ionicons
						name="add-outline"
						size={30}
						color="#000"
						style={{ marginTop: 10, marginLeft: 10 }}
					/>
				</View>
			</TouchableOpacity>
			<Collapsible collapsed={isCollapsed}>
				<View style={styles.formContainer}>
					<TextInput
						placeholder="Brand"
						value={vehicleData.brand}
						onChangeText={(value) => handleInputChange('brand', value)}
						style={styles.input}
					/>
					<TextInput
						placeholder="Model"
						value={vehicleData.model}
						onChangeText={(value) => handleInputChange('model', value)}
						style={styles.input}
					/>
					<TextInput
						placeholder="Year"
						value={vehicleData.year}
						onChangeText={(value) => handleInputChange('year', value)}
						style={styles.input}
					/>
					<TextInput
						placeholder="Price"
						value={vehicleData.price}
						onChangeText={(value) => handleInputChange('price', value)}
						style={styles.input}
					/>
					<Button title="Pick images from gallery" onPress={pickImages} />
					<ScrollView horizontal>
						{images.map((image, index) => (
							<Image
								key={index}
								source={{ uri: image }}
								style={styles.imagePreview}
							/>
						))}
					</ScrollView>
					<Button title="Upload Vehicle" onPress={uploadVehicle} />
				</View>
			</Collapsible>
			<Text style={styles.subtitle}>Your Vehicles</Text>

			{loading ? (
				<ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
			) : vehicles && vehicles.length > 0 ? (
				<>
					{/* show vehicles */}
					{vehicles.map((vehicle) => (
						<Card style={styles.contentCardWrapper} key={vehicle.id}>
							<Card.Content style={styles.contentCardsContainer}>
								<ScrollView horizontal>
									{vehicle.imageUrls.map((url, index) => (
										<Image
											key={index}
											source={{ uri: url }}
											style={styles.vehicleImage}
										/>
									))}
								</ScrollView>
								<Text style={styles.vehicleTxt}>
									{vehicle.brand} {vehicle.model} ({vehicle.year})
								</Text>
								<Text style={[styles.vehicleTxt, styles.price]}>
									{vehicle.price} CFA/Jours
								</Text>
							</Card.Content>
						</Card>
					))}
				</>
			) : (
				// show missing vehicle message
				<Text style={styles.noVehicles}>No Vehicles</Text>
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		marginHorizontal: 12
	},
	subtitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 20,
		marginBottom: 10,
		marginHorizontal: 12
	},

	// form //
	formContainer: {
		marginHorizontal: 12
	},
	input: {
		borderWidth: 1,
		padding: 10,
		borderRadius: 12,
		marginBottom: 10
	},
	contentCardWrapper: {
		marginVertical: 20
	},

	vehicleImage: {
		width: 350,
		height: 250,
		borderRadius: 12,
		resizeMode: 'cover'
	},
	vehicleTxt: {
		fontSize: 20
	},
	price: {
		fontWeight: 'bold'
	},
	imagePreview: {
		width: 100,
		height: 100,
		resizeMode: 'cover',
		marginRight: 5,
		marginVertical: 10
	}
});

export default VendorDashboard;
