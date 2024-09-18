import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

import { db } from '../../../firebase/firebaseConfig';
import { AuthContext } from '../../utils/AuthContext';
import { query, collection, where, getDocs } from 'firebase/firestore';

// Utility to convert Firestore Timestamp to JS Date
const getMonthName = (monthIndex) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months[monthIndex];
};

const ChartBookings = () => {
  const [currentMonth, setCurrentMonth] = useState('');
  const [previous1Month, setPrevious1Month] = useState('');
  const [previous2Month, setPrevious2Month] = useState('');
  const [monthsArray, setMonthsArray] = useState([]);
  const { userData } = useContext(AuthContext);
  const [currentMonthTotal, setCurrentMonthTotal] = useState(0);
  const [thi, setPrevious1MonthTotal] = useState(0);
  const [previous2MonthTotal, setPrevious2MonthTotal] = useState(0);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsQuery = query(
          collection(db, "booking"),
          where("vendorId", "==", userData.uid)
        );
        const querySnapshot = await getDocs(bookingsQuery);

        const bookingsData = querySnapshot.docs.map(doc => {
          const booking = doc.data();
          const bookingDate = booking.bookingDate;

          return {
            id: doc.id,
            ...booking,
            bookingDate, // Store the JS Date
          };
        });


        // Extract months from booking dates
        const monthsArray = bookingsData.map(booking => {
          if (booking.bookingDate) {
            const monthIndex = booking.bookingDate.getMonth();
            return getMonthName(monthIndex);
          }
          return null; // Or a default value if bookingDate is not available
        }).filter(month => month !== null); // Remove null values

        setMonthsArray(monthsArray); // Update state with monthsArray

        // For testing: log booking dates
        console.log("Bookings with Dates:", bookingsData.map(b => b.bookingDate));
        console.log("Months Array:", monthsArray);

      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [userData.uid]);

  // Calculate months for chart labels
  useEffect(() => {
    const today = new Date();
    const currentMonthIndex = today.getMonth();
    const previous1MonthIndex = (currentMonthIndex - 1 + 12) % 12;
    const previous2MonthIndex = (currentMonthIndex - 2 + 12) % 12;

    setCurrentMonth(getMonthName(currentMonthIndex));
    setPrevious1Month(getMonthName(previous1MonthIndex));
    setPrevious2Month(getMonthName(previous2MonthIndex));
  }, []);
const vl = 4
  const data = [
    { value: 2, label: previous2Month },
    { value: vl, label: previous1Month },
    { value: vl, label: currentMonth },
  ];

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Bookings Bar Chart</Text>
    
      <BarChart
        data={data}
        thickness={3}
        color="#6a9fb5"
        noOfSections={4}
        hideDataPoints={false}
        dataPointsColor="blue"
        dataPointsRadius={4}
        yAxisThickness={1}
        xAxisThickness={1}
        yAxisLabelTexts={['0', '5', '10', '15', '20']}
        startFillColor="rgba(106, 159, 181, 0.3)"
        endFillColor="rgba(106, 159, 181, 0.1)"
        startOpacity={0.8}
        endOpacity={0.3}
        isAnimated
      />
    </View>
  );
};

export default ChartBookings;
