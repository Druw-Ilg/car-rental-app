/* eslint-disable react/prop-types */
// SedanScreen
import React from 'react';
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
import { Card, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CARS from '../components/Cars';

const SUVScreen = ({ navigation }) => {
	const RenderCars = (props) => {
		const { brandTitle, cover, details } = props;

		return (
			<Card
				style={styles.contentCardWrapper}
				onPress={() =>
					navigation.navigate('Car', {
						brandTitle: brandTitle,
						cover: cover,
						details: details
					})
				}
			>
				<Card.Content style={styles.contentCardsContainer}>
					<Image source={cover} style={styles.contentCardsCover} />
					<View style={styles.contentCardDetails}>
						<Title variant="titleLarge" style={{ fontWeight: 600 }}>
							{brandTitle}
						</Title>
						<Text variant="bodyMedium" style={{ fontSize: 14 }}>
							{details}
						</Text>

						<Icon name="arrow-right" size={40} color="#000" />
					</View>
				</Card.Content>

				{/* <Card.Actions>
        </Card.Actions> */}
			</Card>
		);
	};
	return (
		<View>
			<View>
				{CARS.filter((car) => car.type === 'SUV').map((sedans) => (
					<RenderCars
						key={sedans.brandTitle}
						brandTitle={sedans.brandTitle}
						cover={sedans.cover}
						details={sedans.details}
					/>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: StatusBar.currentHeight || 0
	},
	blueWrapper: {
		backgroundColor: 'rgb(40 52 74)',
		alignItems: 'center',
		marginBottom: 100
	},

	searchBar: {
		width: '80%',
		backgroundColor: 'transparent',
		marginTop: 30,
		marginBottom: 30,
		borderColor: '#f2f2f3',
		borderBottomWidth: 1,
		borderRadius: 0,
		opacity: 0.6
	},
	headerText: {
		color: '#f3f3f3',
		fontSize: 30,
		textAlign: 'center'
	},
	imgBoxHeaderWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
		marginTop: 80,
		marginBottom: -70
	},
	imgCardHeader: {
		width: '45%',
		margin: 5,
		padding: 5,
		backgroundColor: 'white'
	},
	cardImageHeader: {
		width: '100%',
		height: 85,
		resizeMode: 'contain',
		marginBottom: 10
	},
	carTypes: {
		textAlign: 'center'
	},
	sectionPopulaire: {
		padding: 10
	},
	sectionPopulaireTitles: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	titleSection: {
		fontWeight: '800',
		fontSize: 26,
		textDecorationLine: 'underline',
		color: 'rgb(40 52 74)'
	},
	subTitleSection: {
		fontSize: 20,
		fontWeight: 400,
		color: 'rgb(40 52 74)'
	},
	contentCardWrapper: {
		marginVertical: 20
	},
	contentCardsContainer: {
		width: '100%',
		flexDirection: 'row'
	},
	contentCardsCover: {
		width: '60%',
		height: 150
	},
	contentCardDetails: {
		justifyContent: 'space-around',
		width: '40%',
		marginLeft: 10
	}
});

export default SUVScreen;
