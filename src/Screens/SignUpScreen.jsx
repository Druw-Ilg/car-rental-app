/* eslint-disable react/prop-types */

import React, { useContext, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { AuthContext } from '../utils/AuthContext';

const SignUpScreen = ({ navigation }) => {
	const [isMember, setIsMember] = useState(true);
	const [name, setName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isVendor, setIsVendor] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const { login } = useContext(AuthContext);

	const validateForm = () => {
		if (!name || !email || !password) {
			return 'Le nom, email, et mot de passe sont requis.';
		}
		if (isVendor && !phoneNumber) {
			return 'Le numéro de téléphone est requis pour les loueurs.';
		}
		return null;
	};

	const handleLogin = async () => {
		setLoading(true);

		// Perform login logic based on form input
		try {
			const log = await login(email, password, navigation);
			log == undefined && setErrorMessage('Email ou mot de passe incorrect!');
		} catch (error) {
			setErrorMessage('Erreur: ' + error);
		} finally {
			setLoading(false); // Hide loader
		}
	};

	const handleSignUp = async () => {
		const validationError = validateForm();
		if (validationError) {
			setErrorMessage(validationError);
			return;
		}
		setLoading(true);

		try {
			// Perform sign-up logic based on form input and selected account type

			await createUserWithEmailAndPassword(auth, email, password);

			const user = await addDoc(collection(db, 'users'), {
				name,
				email,
				phoneNumber,
				password,
				isVendor
			});

			if (user.id) {
				console.log(user.id);

				// empty form's fields
				setName('');
				setPhoneNumber('');
				setEmail('');
				setPassword('');

				const log = await login(email, password, navigation);
				typeof log == String && setErrorMessage(log);
			}
		} catch (error) {
			console.error(error);
			setErrorMessage(
				'Une erreur est survenue lors de votre inscription: ',
				error
			);
		} finally {
			setLoading(false); // Hide loader
		}
	};

	return (
		<>
			{isMember ? (
				<View style={styles.container}>
					<Text style={styles.title}>Se connecter</Text>

					{errorMessage ? (
						<Text style={styles.error}>{errorMessage}</Text>
					) : null}

					<TextInput
						style={styles.input}
						placeholder="Email"
						keyboardType="email-address"
						value={email}
						required
						onChangeText={setEmail}
					/>
					<TextInput
						style={styles.input}
						placeholder="Password"
						secureTextEntry
						value={password}
						required
						onChangeText={setPassword}
					/>

					{loading ? (
						<ActivityIndicator
							size="large"
							color="#0000ff"
							style={styles.loader}
						/>
					) : (
						<TouchableOpacity onPress={handleLogin} style={styles.formBtn}>
							<Text style={styles.txtFormBtn}>Connexion</Text>
						</TouchableOpacity>
					)}

					<TouchableOpacity
						onPress={() => {
							setErrorMessage('');
							setIsMember(!isMember);
						}}
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

					{errorMessage ? (
						<Text style={styles.error}>{errorMessage}</Text>
					) : null}

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
					{loading ? (
						<ActivityIndicator
							size="large"
							color="#0000ff"
							style={styles.loader}
						/>
					) : (
						<TouchableOpacity onPress={handleSignUp} style={styles.formBtn}>
							<Text style={styles.txtFormBtn}>S&apos;inscrire</Text>
						</TouchableOpacity>
					)}

					<TouchableOpacity
						onPress={() => {
							setErrorMessage('');
							setIsMember(!isMember);
						}}
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
		paddingHorizontal: 20
	},
	title: {
		fontSize: 34,
		fontWeight: 'bold',
		marginBottom: 20
	},
	input: {
		width: '100%',
		height: 40,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 12,
		paddingHorizontal: 10,
		marginBottom: 10,
		fontSize: 18
	},
	accountTypeButton: {
		alignSelf: 'flex-start',
		marginVertical: 20
	},
	accountTypeButtonText: {
		color: 'blue',
		fontSize: 18
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
	},
	error: {
		color: 'red',
		marginVertical: 10,
		fontSize: 15
	}
});

export default SignUpScreen;
