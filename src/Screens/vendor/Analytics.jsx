import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AuthContext } from '../../utils/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import { useRoute } from '@react-navigation/native';
import ChartBookings from './ChartBookings';

const screenWidth = Dimensions.get('window').width;
const check1 = 'jan 20';
const check2 = 'jul 20';
const check3 = 'Aug 20';

const chartConfig = {
	backgroundGradientFrom: '#ffffff',
	backgroundGradientTo: '#ffffff',
	color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
	strokeWidth: 3,
	barPercentage: 0.9,
	useShadowColorFromDataset: false,
	propsForBackgroundLines: {
		stroke: 'transparent'
	},
	yLabelsOffset: 9999,
	xLabelsOffset: -10
};

const Analytics = ({ route }) => {
	const data = {
		labels: [check1, check2, check3],
		datasets: [
			{
				data: [20, 15, 18],
				strokeWidth: 2
			}
		]
	};
	const { userData } = useContext(AuthContext);
	const [bookings, setBookings] = useState([]);
	const [vehicles, setVehicles] = useState([]);
	const [averageTripLength, setAverageTripLength] = useState('0');
	const [mostRentedCarType, setMostRentedCarType] = useState('Unknown');
	const [revenue, setRevenue] = useState(0);

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const bookingsQuery = query(
					collection(db, 'booking'),
					where('vendorId', '==', userData.uid)
				);
				const querySnapshot = await getDocs(bookingsQuery);

				const bookingsData = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data()
				}));

				setBookings(bookingsData);

				const calculateAverageTripLength = () => {
					try {
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
					} catch (error) {
						console.error('Error calculating average trip length: ', error);
					}
				};

				const calculateRevenue = () => {
					const acceptedBookings = bookingsData.filter(
						(booking) => booking.bookingStatus === 'accepted'
					);
					const totalRevenue = acceptedBookings.reduce((sum, booking) => {
						const startDate = booking.startDate
							? new Date(booking.startDate)
							: null;
						const endDate = booking.endDate ? new Date(booking.endDate) : null;

						if (startDate && endDate && endDate > startDate && booking.price) {
							const days = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1; // Include the last day in the count
							return sum + booking.price * days;
						}
						return sum;
					}, 0);
					setRevenue(totalRevenue);
				};

				calculateAverageTripLength();
				calculateRevenue();
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
	}, [userData.uid]);

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.heading}>How you&apos;re doing</Text>

			{bookings.length > 0 && (
				<View style={styles.section}>
					<Text style={styles.label}>Bookings</Text>
					<Text style={styles.value}>{bookings.length}</Text>
					<Text style={styles.subtext}>
						Last 3 months <Text style={styles.greenText}>+15%</Text>
					</Text>
					<LineChart
						data={data}
						width={screenWidth + 4}
						height={180}
						chartConfig={chartConfig}
						bezier
						withDots={false}
						withVerticalLabels={true}
						withHorizontalLabels={true}
						style={styles.chart}
					/>
				</View>
			)}

			<View style={styles.section}>
				<Text style={styles.label}>Revenue</Text>
				<Text style={styles.value}>${revenue}</Text>
				<Text style={styles.subtext}>
					Last 3 months <Text style={styles.greenText}>+20%</Text>
				</Text>
				<ChartBookings />
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
