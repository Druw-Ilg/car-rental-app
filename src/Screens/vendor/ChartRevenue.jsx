import React, { useState, useContext, useCallback } from 'react';
import { View, Dimensions } from 'react-native';
import { db } from '../../../firebase/firebaseConfig';
import { AuthContext } from '../../utils/AuthContext';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.9,
  useShadowColorFromDataset: true,
  propsForBackgroundLines: {
    stroke: 'transparent',
  },
  yLabelsOffset: 9999,
  xLabelsOffset: -10,
};

const ChartRevenue = () => {
  const { userData } = useContext(AuthContext);
  const [currentMonthTotal, setCurrentMonthTotal] = useState(0);
  const [previousMonthTotal, setPreviousMonthTotal] = useState(0);
  const [previousMonth2Total, setPreviousMonth2Total] = useState(0);
  const [currentMonthName, setCurrentMonthName] = useState('');
  const [previousMonthName, setPreviousMonthName] = useState('');
  const [previousMonth2Name, setPreviousMonth2Name] = useState('');

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const bookingsQuery = query(
        collection(db, 'booking'),
        where('vendorId', '==', userData.uid),
        where('bookingStatus', '==', 'accepted')
      );
      const querySnapshot = await getDocs(bookingsQuery);

      const bookings = querySnapshot.docs.map((doc) => {
        const booking = doc.data();
        return {
          id: doc.id,
          ...booking,
        };
      });

      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
      const previousMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      const previousMonth = previousMonthDate.toLocaleString('default', { month: 'short' });
      const previousMonth2Date = new Date(previousMonthDate.setMonth(previousMonthDate.getMonth() - 1));
      const previousMonth2 = previousMonth2Date.toLocaleString('default', { month: 'short' });

      setCurrentMonthName(currentMonth);
      setPreviousMonthName(previousMonth);
      setPreviousMonth2Name(previousMonth2);

      let currentMonthTotal = 0;
      let previousMonthTotal = 0;
      let previousMonth2Total = 0;

      bookings.forEach((booking) => {
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        const pricePerDay = booking.price || 0;
      
        // Calculate the number of days between startDate and endDate (inclusive)
        const diffTime = endDate - startDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both start and end date
        const totalPrice = diffDays * pricePerDay;
  
        const bookingMonth = startDate.toLocaleString('default', { month: 'short' });
      
        if (bookingMonth === currentMonth) {
          currentMonthTotal += totalPrice;
        } else if (bookingMonth === previousMonth) {
          previousMonthTotal += totalPrice;
        } else if (bookingMonth === previousMonth2) {
          previousMonth2Total += totalPrice;
        }
      });
      

      setCurrentMonthTotal(parseFloat(currentMonthTotal.toFixed(2)));
      setPreviousMonthTotal(parseFloat(previousMonthTotal.toFixed(2)));
      setPreviousMonth2Total(parseFloat(previousMonth2Total.toFixed(2)));
      
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Use useFocusEffect to fetch bookings when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [userData.uid])
  );

  if (currentMonthTotal === 0 && previousMonthTotal === 0 && previousMonth2Total === 0) {
    return null;
  }

  const data = {
    labels: [previousMonth2Name, previousMonthName, currentMonthName],
    datasets: [
      {
        data: [previousMonth2Total, previousMonthTotal, currentMonthTotal],
      },
    ],
  };
  return (
    <View style={{ padding: 20 }}>
      <LineChart
        data={data}
        width={screenWidth + 30}
        height={256}
        chartConfig={chartConfig}
        bezier
      />
    </View>
  );
};

export default ChartRevenue;
