/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import {
	StyleSheet,
	ScrollView,
	Animated,
	View,
	Text,
	ImageBackground,
	useWindowDimensions,
	TouchableOpacity
} from 'react-native';

export function FormBtn({ btnLink, btnText }) {
	return (
		<TouchableOpacity onPress={btnLink} style={styles.formBtn}>
			<Text style={styles.txtFormBtn}>{btnText}</Text>
		</TouchableOpacity>
	);
}

export function ImagesCaroussel({ vehicle }) {
	const scrollX = useRef(new Animated.Value(0)).current;
	const { width: windowWidth } = useWindowDimensions();

	return (
		<>
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
		</>
	);
}
const styles = StyleSheet.create({
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

	//******** Form Btn **********//

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
	}
});
