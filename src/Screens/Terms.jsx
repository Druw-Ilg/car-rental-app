import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Policies_Terms_Contact_Styles } from '../Styles';

function Terms() {
	return (
		<SafeAreaView>
			<View style={Styles.wrapper}>
				<Text>Nos Termes</Text>
			</View>
		</SafeAreaView>
	);
}

const Styles = StyleSheet.create(Policies_Terms_Contact_Styles);

export default Terms;
