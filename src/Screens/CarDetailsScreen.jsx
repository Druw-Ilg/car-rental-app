/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useRef } from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	ScrollView,
	ImageBackground,
	Animated,
	SafeAreaView,
	useWindowDimensions,
	Linking,
	Platform
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/MaterialCommunityIcons';

export const CarDetailsScreen = ({ route, navigation }) => {
	const { vehicle } = route.params;
	const scrollX = useRef(new Animated.Value(0)).current;

	const { width: windowWidth } = useWindowDimensions();

	const makePhoneCall = () => {
		const pn = '077001174';
		if (Platform.OS == 'android') {
			Linking.openURL(`tel:${pn}`);
		} else {
			Linking.openURL(`telprompt:${pn}`);
		}
	};
	return (
		<SafeAreaView style={styles.container}>
			<View>
				<ScrollView
					horizontal={true}
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					onScroll={Animated.event(
						[
							{
								nativeEvent: {
									contentOffset: {
										x: scrollX
									}
								}
							}
						],
						{ useNativeDriver: false }
					)}
					scrollEventThrottle={1}
				>
					{vehicle.imageUrls.map((url, index) => (
						<View style={{ width: windowWidth, height: 250 }} key={index}>
							<ImageBackground
								source={{ uri: url }}
								style={styles.vehicleImage}
							></ImageBackground>
						</View>
					))}
				</ScrollView>
				<View style={styles.indicatorContainer}>
					{vehicle.imageUrls.map((image, imageIndex) => {
						const width = scrollX.interpolate({
							inputRange: [
								windowWidth * (imageIndex - 1),
								windowWidth * imageIndex,
								windowWidth * (imageIndex + 1)
							],
							outputRange: [8, 16, 8],
							extrapolate: 'clamp'
						});
						return (
							<Animated.View
								key={imageIndex}
								style={[styles.normalDot, { width }]}
							/>
						);
					})}
				</View>

				<Text style={styles.title}>
					{vehicle.brand} {vehicle.model} ({vehicle.year})
				</Text>
				<Text style={[styles.detailText, styles.price]}>
					{vehicle.price} CFA/Jours
				</Text>
			</View>

			<TouchableOpacity
				onPress={() => makePhoneCall()}
				style={styles.contactBtn}
			>
				<FontAwesome name="phone" size={30} color="#fff" />
			</TouchableOpacity>

			<Text style={[styles.title, styles.titleDetails]}>Détails</Text>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	// Vehicles caroussel //
	vehicleImage: {
		flex: 1,
		marginVertical: 4,
		borderRadius: 5,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center'
	},
	normalDot: {
		height: 8,
		width: 8,
		borderRadius: 4,
		backgroundColor: 'silver',
		marginHorizontal: 4
	},
	indicatorContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	// Vehicles caroussel //
	title: {
		fontSize: 24,
		padding: 12,
		fontWeight: 'bold'
	},
	titleDetails: {
		textDecorationLine: 'underline',
		textDecorationStyle: 'dashed'
	},
	details: {
		fontSize: 20,
		fontWeight: '300',
		paddingHorizontal: 12,
		paddingBottom: 20
	},
	bgDetailText: {
		backgroundColor: '#28344A',
		padding: 7,
		borderRadius: 30,
		width: 90,
		marginLeft: 17
	},
	detailText: {
		fontSize: 20
	},
	price: {
		fontWeight: 'bold',
		padding: 12
	},

	contactBtn: {
		backgroundColor: 'rgb(40 52 74)',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 12,
		margin: 20,
		fontWeight: 'bold',
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 7
	}
});

export default CarDetailsScreen;
