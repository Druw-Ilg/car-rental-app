/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Header = (props) => {
	const { navigation } = props;

	return <View style={styles.wrapper}></View>;
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
