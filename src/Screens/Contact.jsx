import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Policies_Terms_Contact_Styles } from '../Styles';

function Contact() {
	return (
		<SafeAreaView>
			<View style={Styles.wrapper}>
				<Text>Notre Contact</Text>
			</View>
		</SafeAreaView>
	);
}

const Styles = StyleSheet.create(Policies_Terms_Contact_Styles);

export default Contact;
