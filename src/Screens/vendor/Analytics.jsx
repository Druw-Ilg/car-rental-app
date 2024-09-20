import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import {
	collection,
	query,
	where,
	getDocs,
	onSnapshot
} from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import ChartBookings from './ChartBookings';
import ChartRevenue from './ChartRevenue';

const Analytics = ({ route }) => {
	const { userData } = useContext(AuthContext);
	const [bookings, setBookings] = useState([]);
	const [vehicles, setVehicles] = useState([]);
	const [averageTripLength, setAverageTripLength] = useState('0');
	const [mostRentedCarType, setMostRentedCarType] = useState('Unknown');
	const [revenue, setRevenue] = useState(0);

	// Fetch bookings when the screen is focused
	useFocusEffect(
		useCallback(() => {
			const fetchBookings = async () => {
				try {
					const bookingsQuery = query(
						collection(db, 'booking'),
						where('vendorId', '==', userData.uid),
						where('bookingStatus', '==', 'accepted')
					);

					const unsubscribe = onSnapshot(bookingsQuery, (querySnapshot) => {
						const bookingsData = querySnapshot.docs.map((doc) => ({
							id: doc.id,
							...doc.data()
						}));

						setBookings(bookingsData);

						// Calculate average trip length
						const totalDuration = bookingsData.reduce((acc, booking) => {
							const startDate = booking.startDate
								? new Date(booking.startDate)
								: null;
							const endDate = booking.endDate
								? new Date(booking.endDate)
								: null;

							if (startDate && endDate && endDate > startDate) {
								const duration = (endDate - startDate) / (1000 * 60 * 60 * 24);
								return acc + duration;
							}

							return acc;
						}, 0);

						const average =
							bookingsData.length > 0
								? (totalDuration / bookingsData.length).toFixed(2)
								: '0';
						setAverageTripLength(average);

						// Calculate revenue
						const totalRevenue = bookingsData.reduce((sum, booking) => {
							const startDate = booking.startDate
								? new Date(booking.startDate)
								: null;
							const endDate = booking.endDate
								? new Date(booking.endDate)
								: null;

							if (
								startDate &&
								endDate &&
								endDate > startDate &&
								booking.price
							) {
								const days = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1; // Include the last day
								return sum + booking.price * days;
							}
							return sum;
						}, 0);

						setRevenue(totalRevenue);
					});

					// Cleanup the listener when the screen is unfocused
					return () => unsubscribe();
				} catch (error) {
					console.error('Error fetching bookings: ', error);
				}
			};

			const fetchVehicles = async () => {
				try {
					const vehiclesQuery = query(
						collection(db, 'vehicles'),
						where('vendorId', '==', userData.uid)
					);
					const querySnapshot = await getDocs(vehiclesQuery);

					const vehiclesData = querySnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data()
					}));

					setVehicles(vehiclesData);

					// Calculate most rented car type
					const typeCounts = vehiclesData.reduce((acc, vehicle) => {
						const type = vehicle.type || 'Unknown';
						acc[type] = (acc[type] || 0) + 1;
						return acc;
					}, {});

					// Determine the most rented type
					const sedansCount = typeCounts['Berline/Sedan'] || 0;
					const suvsCount = typeCounts['Cross/SUV'] || 0;

					let mostRentedType;
					if (sedansCount === suvsCount) {
						mostRentedType = 'Both';
					} else {
						mostRentedType = Object.keys(typeCounts).reduce(
							(a, b) => (typeCounts[a] > typeCounts[b] ? a : b),
							'Unknown'
						);
					}

					setMostRentedCarType(mostRentedType);
				} catch (error) {
					console.error('Error fetching vehicles: ', error);
				}
			};

			fetchBookings();
			fetchVehicles();
		}, [userData.uid]) // Dependencies for useFocusEffect
	);

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.heading}>How you're doing</Text>

			{bookings.length > 0 && (
				<View style={styles.section}>
					<Text style={styles.label}>Bookings</Text>
					<Text style={styles.value}>{bookings.length}</Text>
					<Text style={styles.subtext}>
						Last 3 months <Text style={styles.greenText}>+15%</Text>
					</Text>
					<ChartBookings />
				</View>
			)}

			<View style={styles.section}>
				<Text style={styles.label}>Revenue</Text>
				<Text style={styles.value}>${revenue}</Text>
				<Text style={styles.subtext}>
					Last 3 months <Text style={styles.greenText}>+20%</Text>
				</Text>
				<ChartRevenue />
				<View style={styles.cardContainer}>
					<View style={styles.cardRow}>
						<View style={styles.card}>
							<Text style={styles.labelCards}>Cars listed</Text>
							<Text style={styles.valueCards}>{vehicles.length}</Text>
						</View>
						<View style={styles.card}>
							<Text style={styles.labelCards}>Most rented car type</Text>
							<Text style={styles.valueCards}>{mostRentedCarType}</Text>
						</View>
					</View>
					<View style={styles.cardRow}>
						<View style={styles.card}>
							<Text style={styles.labelCards}>Average trip length</Text>
							<Text style={styles.valueCards}>{averageTripLength} days </Text>
						</View>
						<View style={styles.card}>
							<Text style={styles.labelCards}>Total Bookings</Text>
							<Text style={styles.valueCards}>{bookings.length}</Text>
						</View>
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 10
	},
	heading: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	section: {
		padding: 10,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8
	},
	label: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 10
	},
	value: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 5
	},
	subtext: {
		fontSize: 14,
		color: '#666',
		marginBottom: 15
	},
	greenText: {
		color: '#00BFA5'
	},
	cardContainer: {
		flex: 1,
		flexDirection: 'column'
	},
	cardRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flex: 0.5
	},
	card: {
		flex: 1,
		padding: 20,
		borderRadius: 10,
		margin: 10,
		alignItems: 'center',
		borderRadius: 18,
		borderColor: 'gray',
		borderWidth: 0.4
	},
	labelCards: {
		fontSize: 16,
		color: '#6c757d'
	},
	valueCards: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#000',
		marginTop: 5
	}
});

export default Analytics;
