/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StyleSheet,
	Image,
	ScrollView,
	StatusBar
} from 'react-native';
import { Searchbar, Card, Title } from 'react-native-paper';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CARS from '../components/Cars';

const CustomSearchIcon = () => (
	<View style={{ marginRight: 10 }}>
		<Icon name="magnify" size={40} color="white" />
	</View>
);

const HomeScreen = ({ navigation }) => {
	const RenderCars = (props) => {
		const { brandTitle, cover, details } = props;

		// Limit car details to maximum 20 words
		const renderDetails = (details) => {
			// Split the details into words
			const words = details.split(' ');
			// If the number of words exceeds 15, truncate and append ellipsis
			if (words.length > 15) {
				return words.slice(0, 15).join(' ') + '...';
			} else {
				return details + '...';
			}
		};

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
							{renderDetails(details)}
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
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View style={styles.blueWrapper}>
					<Header navigation={navigation} />

					<Searchbar
						style={styles.searchBar}
						placeholder="Une marque ou un concessionnaire"
						placeholderTextColor="#fff"
						inputStyle={{ color: 'white' }}
						icon={() => <CustomSearchIcon />}
					/>

					{/* Welcome text */}
					<Text style={styles.headerText}>
						Louer un véhicule n&apos;a jamais été aussi facile.
					</Text>

					{/* Cards at the bottom */}
					<View style={styles.imgBoxHeaderWrapper}>
						<Card
							style={styles.imgCardHeader}
							onPress={() => navigation.navigate('Sedan')}
						>
							<Card.Content>
								<Image
									// eslint-disable-next-line no-undef
									source={require('../../assets/blue-sedan.jpg')}
									style={styles.cardImageHeader}
								/>
								<Title style={styles.carTypes}>Sedan</Title>
							</Card.Content>
						</Card>

						<Card
							style={styles.imgCardHeader}
							onPress={() => navigation.navigate('SUV')}
						>
							<Card.Content>
								<Image
									// eslint-disable-next-line no-undef
									source={require('../../assets/blue-suv.jpg')}
									style={styles.cardImageHeader}
								/>
								<Title style={styles.carTypes}>SUV</Title>
							</Card.Content>
						</Card>
					</View>
				</View>

				<View style={styles.sectionPopulaire}>
					<View style={styles.sectionPopulaireTitles}>
						<Title style={styles.titleSection}>Populaire</Title>
						<Title style={styles.subTitleSection}>Tout voir</Title>
					</View>
				</View>
				<View>
					{CARS.map((car) => (
						<RenderCars
							key={car.brandTitle}
							brandTitle={car.brandTitle}
							cover={car.cover}
							details={car.details}
						/>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
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

export default HomeScreen;
