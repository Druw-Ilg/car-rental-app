/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Header = (props) => {
	const { navigation } = props;

	return (
		<View style={styles.wrapper}>
			<TouchableOpacity
				onPress={() => navigation.openDrawer()}
				style={{ marginTop: 20 }}
			>
				<Icon name="segment" size={50} color="#fff" />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
		padding: 10
	}
});

export default Header;
