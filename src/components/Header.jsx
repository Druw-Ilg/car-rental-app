/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import * as React from 'react';
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Header = (props) => {
	const { navigation } = props;
	return (
		<View style={styles.wrapper}>
			<TouchableOpacity
				onPress={() => navigation.openDrawer()}
				style={{ marginTop: 20 }}
			>
				<Icon name="menu" size={50} color="#fff" />
			</TouchableOpacity>
			<Image
				source={require('../../assets/user-profile.jpg')}
				style={styles.profile}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 30,
		padding: 10
	},
	profile: {
		width: 70,
		height: 70,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: 'white'
	}
});

export default Header;
