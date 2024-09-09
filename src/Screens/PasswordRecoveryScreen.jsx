import React, { useState } from 'react';
import {
	Text,
	TextInput,
	View,
	ActivityIndicator,
	StyleSheet
} from 'react-native';
import { FormBtn } from '../components/UIComponents';

function PasswordRecoveryScreen() {
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [email, setEmail] = useState('');

	const sendPasswordResetLink = () => {
		setLoading(true);
		console.log('Link to reset password');
		setLoading(false);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Avez-vous oubliez votre mot de passe?</Text>
			<Text style={styles.instructionText}>
				Entrez l&apos;adresse email que vous utilisez pour Cotché et nous vous
				enverrons un lien pour réinitialiser votre mot de passe.
			</Text>
			{errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

			<TextInput
				style={styles.input}
				placeholder="Email"
				keyboardType="email-address"
				value={email}
				required
				onChangeText={setEmail}
			/>

			{loading ? (
				<ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
			) : (
				<>
					<FormBtn btnLink={sendPasswordResetLink} btnText={'Réinitialiser'} />
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,

		alignItems: 'center',
		paddingHorizontal: 20
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginVertical: 20,
		textAlign: 'center'
	},
	instructionText: {
		fontSize: 18,
		color: '#030303',
		marginBottom: 10,
		textAlign: 'center'
	},
	input: {
		width: '100%',
		height: 50,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 12,
		paddingHorizontal: 10,
		marginBottom: 10,
		fontSize: 20
	},
	error: {
		color: 'red',
		marginVertical: 10,
		fontSize: 15
	}
});
export default PasswordRecoveryScreen;
