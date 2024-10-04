/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import {
	Menu,
	MenuOptions,
	MenuOption,
	MenuTrigger,
	MenuProvider
} from 'react-native-popup-menu';
import {
	View,
	Text,
	TextInput,
	Image,
	ImageBackground,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	ScrollView,
	Modal
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../utils/AuthContext';
import { db, storage } from '../../../firebase/firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Collapsible from 'react-native-collapsible';
import { ImagesCaroussel } from '../../components/UIComponents';
import { Picker } from '@react-native-picker/picker';
import BoostingList from './BoostingList';

const Cars = () => {
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	const openModal = () => {
		setModalVisible(true);
	};

	const closeModal = () => {
		setModalVisible(false);
	};

	const { userData } = useContext(AuthContext);
	const [vehicles, setVehicles] = useState([]);
	const [vehicleData, setVehicleData] = useState({
		type: '',
		brand: '',
		model: '',
		year: '',
		price: '',
		pickupLocation: '',
		dropoffLocation: ''
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
					const fetchedVehicles = querySnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data()
					}));
					setVehicles(fetchedVehicles);
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
	const callBoosting = () => {
		return <BoostingList visible={openModal} onClose={closeModal} />;
	};
	const uploadVehicle = async () => {
		console.log(userData.uid);

		setLoading(true);
		if (!vehicleData.type) {
			console.error('Vous devez sélectionner un type de véhicules!');
		} else {
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
							vendorPhoneNumber: userData.phoneNumber,
							imageUrls
						});
						if (vehicle) {
							setVehicleData({
								brand: '',
								model: '',
								year: '',
								price: '',
								pickupLocation: '',
								dropoffLocation: ''
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
		}
		setLoading(false);
	};

	return (
		<ScrollView style={styles.container}>
			{/* add new vehicle dropdown */}
			<TouchableOpacity
				onPress={() => setIsCollapsed(!isCollapsed)}
				style={[styles.androidShadow, styles.boxShadow]}
			>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={styles.subtitle}>Ajouter un véhicule</Text>

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
					<Picker
						selectedValue={vehicleData.type}
						onValueChange={(value) => handleInputChange('type', value)}
					>
						<Picker.Item label="Type de véhicule:" enabled={false} />
						<Picker.Item label="Berline/Sedan" value="Berline/Sedan" />
						<Picker.Item label="Cross/SUV" value="Cross/SUV" />
					</Picker>

					<TextInput
						placeholder="Marque"
						value={vehicleData.brand}
						onChangeText={(value) => handleInputChange('brand', value)}
						style={styles.input}
					/>
					<TextInput
						placeholder="Modèle"
						value={vehicleData.model}
						onChangeText={(value) => handleInputChange('model', value)}
						style={styles.input}
					/>
					<TextInput
						placeholder="Année"
						value={vehicleData.year}
						onChangeText={(value) => handleInputChange('year', value)}
						style={styles.input}
					/>
					<TextInput
						placeholder="Prix/Jour"
						value={vehicleData.price}
						onChangeText={(value) => handleInputChange('price', value)}
						style={styles.input}
					/>
					<TextInput
						placeholder="Abholort"
						value={vehicleData.pickupLocation}
						onChangeText={(value) => handleInputChange('pickupLocation', value)}
						style={styles.input}
					/>
					<TextInput
						placeholder="Abgabeort"
						value={vehicleData.dropoffLocation}
						onChangeText={(value) =>
							handleInputChange('dropoffLocation', value)
						}
						style={styles.input}
					/>

					<ScrollView horizontal>
						{images.map((image, index) => (
							<Image
								key={index}
								source={{ uri: image }}
								style={styles.imagePreview}
							/>
						))}
					</ScrollView>

					{!images.length > 0 ? (
						<TouchableOpacity onPress={pickImages} style={styles.formBtn}>
							<Text style={styles.txtFormBtn}>Image(s) du véhicule</Text>
						</TouchableOpacity>
					) : loading ? (
						<ActivityIndicator
							size="large"
							color="#0000ff"
							style={styles.loader}
						/>
					) : (
						<TouchableOpacity onPress={uploadVehicle} style={styles.formBtn}>
							<Text style={styles.txtFormBtn}>Enregistrer</Text>
						</TouchableOpacity>
					)}
				</View>
			</Collapsible>
			<Text style={styles.subtitle}>Your Vehicles</Text>

			{loading ? (
				<ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
			) : vehicles && vehicles.length > 0 ? (
				<>
					{/* show vehicles */}
					{vehicles.map((vehicle) => (
						<View
							style={[
								styles.contentCardWrapper,
								styles.boxShadow,
								styles.androidShadow
							]}
							key={vehicle.id}
						>
							<Image
								source={{ uri: vehicle.imageUrls[0] }}
								style={styles.imageCar}
							/>

							<View style={styles.VehicleDetails}>
								<Text style={styles.vehicleName}>
									{vehicle.year} {vehicle.brand} {vehicle.model}
								</Text>
								<Text style={styles.vehiclePrice}>
									{vehicle.price} cfa/jours
								</Text>

								<BoostingList visible={modalVisible} onClose={closeModal} />
								<Menu>
									<MenuTrigger style={{ backgroundColor: 'transparent' }}>
										<Image
											source={require('..//..//../assets/more.png')}
											style={styles.moreIcon}
										/>
									</MenuTrigger>
									<MenuOptions style={styles.OptionsPopup}>
										{/*<MenuOption onSelect={openModal}>
											 <Text style={styles.menuOptionText}>
          <Image source={require('..//..//../assets/power.png')} style={styles.popUpIcons} />
          Boost
        </Text> 
										</MenuOption>*/}
										{/* <MenuOption onSelect={() => alert('Edit')}>
            <Text style={styles.menuOptionText}><Image source={require('..//..//../assets/edit.png')} style={styles.popUpIcons}/> Edit</Text>
        </MenuOption> */}
										<MenuOption onSelect={() => alert('Delete')}>
											<Text style={styles.menuOptionText}>
												<Image
													source={require('..//..//../assets/delete.png')}
													style={styles.popUpIcons}
												/>{' '}
												Delete
											</Text>
										</MenuOption>
									</MenuOptions>
								</Menu>
							</View>
						</View>
					))}
				</>
			) : (
				<Text style={styles.subtitle}>
					Pas de véhicule pour l&apos;instant...
				</Text>
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
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
		marginVertical: 20,
		flex: 1,
		flexDirection: 'row'
	},
	imageCar: {
		width: '50%',
		height: 120,
		borderRadius: 10,
		marginRight: 10,
		objectFit: 'cover'
	},
	VehicleDetails: {
		flex: 1,
		paddingHorizontal: 3,
		justifyContent: 'space-between'
	},
	vehicleName: {
		fontSize: 14,
		fontWeight: 'bold'
	},
	vehiclePrice: {
		fontSize: 13,
		color: '#888'
	},
	boxShadow: {
		shadowColor: 'blue',
		shadowOffset: { width: 6, height: 6 },
		shadowOpacity: 0.6,
		shadowRadius: 10
	},
	androidShadow: {
		elevation: 10
	},
	noVehicles: {
		flex: 1,
		height: 300,
		opacity: 0.2,
		justifyContent: 'center'
	},

	moreIcon: {
		width: 34,
		height: 34,
		alignSelf: 'flex-end'
	},
	OptionsPopup: {
		backgroundColor: '#f0f3f7',
		borderRadius: 8,
		padding: 10,
		overflow: 'hidden',
		width: 130,
		justifyContent: 'center',
		position: 'absolute',
		right: 10,
		top: -10
	},
	menuOption: {
		borderBottomWidth: 1,
		borderBottomColor: '#ddd'
	},
	popUpIcons: {
		width: 20,
		height: 20
	},
	menuOptionText: {
		backgroundColor: 'transparent', // Transparent background for the blurred view
		borderRadius: 8,
		overflow: 'hidden',
		fontWeight: 'lighter',
		fontSize: 13
	},
	vehicleImage: {
		width: 350,
		height: 250,
		borderRadius: 12,
		resizeMode: 'cover'
	},
	vehicleTxt: {
		marginLeft: 12,
		fontSize: 20
	},
	price: {
		fontWeight: 'bold'
	},
	imagePreview: {
		width: 150,
		height: 100,
		resizeMode: 'cover',
		marginRight: 5,
		marginVertical: 10
	},
	formBtn: {
		backgroundColor: 'rgb(40 52 74)',
		width: '100%',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 12,
		marginTop: 20,
		fontWeight: 'bold'
	},
	txtFormBtn: {
		color: '#fff',
		fontSize: 18,
		textAlign: 'center'
	}
});

export default Cars;
