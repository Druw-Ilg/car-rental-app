/* eslint-disable react/prop-types */

import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase/firebaseConfig';

const SignUpScreen = ({ navigation }) => {
	const [isMember, setIsMember] = useState(true);
	const [name, setName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isVendor, setIsVendor] = useState(false);

	//if he/she is a member
	const handleLogin = async () => {
		// Perform login logic based on form input
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);

		console.log(userCredential);
		// Reset form fields after sign-up
		// setEmail('');
		// setPassword('');
	};

	// if not a member
	const handleSignUp = async () => {
		try {
			// Perform sign-up logic based on form input and selected account type

			const user = { name, phoneNumber, email, isVendor };

			// Save user session using AsyncStorage

			// Log in the user

			// Reset form fields after sign-up
			setName('');
			setPhoneNumber('');
			setEmail('');
			setPassword('');

			console.log(user);

			// Navigate to Home
			navigation.navigate('HomeDrawer');
		} catch (error) {
			console.error(error);
			alert('Failed to regiter');
		}
	};

	return (
		<>
			{isMember ? (
				<View style={styles.container}>
					<Text style={styles.title}>Se connecter</Text>

					<TextInput
						style={styles.input}
						placeholder="Email"
						keyboardType="email-address"
						value={email}
						onChangeText={setEmail}
					/>
					<TextInput
						style={styles.input}
						placeholder="Password"
						secureTextEntry
						value={password}
						onChangeText={setPassword}
					/>

					<Button title="Connexion" onPress={handleLogin} />

					<TouchableOpacity
						onPress={() => setIsMember(!isMember)}
						style={styles.accountTypeButton}
					>
						<Text style={styles.accountTypeButtonText}>
							Pas membre? S&apos;inscrire
						</Text>
					</TouchableOpacity>
				</View>
			) : (
				<View style={[!isVendor ? styles.container : styles.vendorContainer]}>
					<Text style={styles.title}>S&apos;inscrire</Text>
					<TextInput
						style={styles.input}
						placeholder="Name/Company Name"
						value={name}
						onChangeText={setName}
					/>
					<TextInput
						style={styles.input}
						placeholder="Phone Number"
						keyboardType="phone-pad"
						value={phoneNumber}
						onChangeText={setPhoneNumber}
					/>
					<TextInput
						style={styles.input}
						placeholder="Email"
						keyboardType="email-address"
						value={email}
						onChangeText={setEmail}
					/>
					<TextInput
						style={styles.input}
						placeholder="Password"
						secureTextEntry
						value={password}
						onChangeText={setPassword}
					/>
					<TouchableOpacity
						onPress={() => setIsVendor(!isVendor)}
						style={styles.accountTypeButton}
					>
						<Text style={styles.accountTypeButtonText}>
							{isVendor
								? 'Switch to Member Account'
								: 'Switch to Vendor Account'}
						</Text>
					</TouchableOpacity>
					<Button title="S'inscrire" onPress={handleSignUp} />
					<TouchableOpacity
						onPress={() => setIsMember(!isMember)}
						style={styles.accountTypeButton}
					>
						<Text style={styles.accountTypeButtonText}>
							Déjà membre? Se connecter
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20
	},
	vendorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
		backgroundColor: 'rgb(40 52 74)'
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20
	},
	input: {
		width: '100%',
		height: 40,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 10
	},
	accountTypeButton: {
		alignSelf: 'flex-start',
		marginBottom: 20
	},
	accountTypeButtonText: {
		color: 'blue'
	}
});

export default SignUpScreen;
