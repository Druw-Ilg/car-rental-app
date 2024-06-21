import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Text } from 'react-native';

function VendorScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<Text style={{ textAlign: 'center' }}>Vendor Screen</Text>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: StatusBar.currentHeight || 0
	}
});
export default VendorScreen;
