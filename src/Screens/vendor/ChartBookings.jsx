import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Dimensions } from 'react-native';
import { db } from '../../../firebase/firebaseConfig';
import { AuthContext } from '../../utils/AuthContext';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';

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

const ChartBookings = () => {
  const { userData } = useContext(AuthContext);
  const [currentMonthCount, setCurrentMonthCount] = useState(0);
  const [previousMonthCount, setPreviousMonthCount] = useState(0);
  const [previousMonth2Count, setPreviousMonth2Count] = useState(0);
  const [currentMonthName, setCurrentMonthName] = useState('');
  const [previousMonthName, setPreviousMonthName] = useState('');
  const [previousMonth2Name, setPreviousMonth2Name] = useState('');

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

      // Get the current, previous, and two months ago in short form (e.g., "Jan", "Feb")
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('default', { month: 'short' });

      const previousMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      const previousMonth = previousMonthDate.toLocaleString('default', { month: 'short' });

      const previousMonth2Date = new Date(previousMonthDate.setMonth(previousMonthDate.getMonth() - 1));
      const previousMonth2 = previousMonth2Date.toLocaleString('default', { month: 'short' });

      // Set month names
      setCurrentMonthName(currentMonth);
      setPreviousMonthName(previousMonth);
      setPreviousMonth2Name(previousMonth2);

      // Count bookings for each month
      let currentMonthCount = 0;
      let previousMonthCount = 0;
      let previousMonth2Count = 0;

      bookings.forEach((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        const month = bookingDate.toLocaleString('default', { month: 'short' });

        if (month === currentMonth) {
          currentMonthCount += 1;
        } else if (month === previousMonth) {
          previousMonthCount += 1;
        } else if (month === previousMonth2) {
          previousMonth2Count += 1;
        }
      });

      // Set counts in state
      setCurrentMonthCount(currentMonthCount);
      setPreviousMonthCount(previousMonthCount);
      setPreviousMonth2Count(previousMonth2Count);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings(); // Fetch bookings every time the screen is focused
    }, [userData.uid])
  );

  if (currentMonthCount === 0 && previousMonthCount === 0 && previousMonth2Count === 0) {
    return null;
  }

  const data = {
    labels: [previousMonth2Name, previousMonthName, currentMonthName],
    datasets: [
      {
        data: [previousMonth2Count, previousMonthCount, currentMonthCount],
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

export default ChartBookings;
