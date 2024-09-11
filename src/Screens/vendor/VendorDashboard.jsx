import React, { useContext, useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Cars from './Cars';
import BookingRequests from './BookingRequests';
import Analytics from './Analytics';
import { db } from '../../../firebase/firebaseConfig';
import { AuthContext } from '../../utils/AuthContext';
import { query, collection, where, getDocs, orderBy } from 'firebase/firestore';

const Tab = createMaterialTopTabNavigator();

const VendorDashboard = () => {
  const { userData } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [firstBookingDate, setFirstBookingDate] = useState();
  const [lastBookingDate, setLastBookingDate] = useState();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsQuery = query(
          collection(db, "booking"), 
          where("vendorId", "==", userData.uid),
          orderBy("bookingDate") // Ensure the bookings are ordered by date
        );
        const querySnapshot = await getDocs(bookingsQuery);

        const bookingsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBookings(bookingsData);

        if (bookingsData.length > 0) {
          const firstBooking = bookingsData[0];
          const lastBooking = bookingsData[bookingsData.length - 1];


          const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            const options = { month: 'short', year: '2-digit' };
            return date.toLocaleDateString('en-US', options);
          };

          // Set the first booking date
          if (firstBooking.bookingDate) {
            setFirstBookingDate(formatDate(firstBooking.bookingDate));
          }

          // Set the last booking date
          if (lastBooking.bookingDate) {
            setLastBookingDate(formatDate(lastBooking.bookingDate));
          }
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [userData.uid]); // Fetch fresh data when the component is mounted or userData.uid changes

  return (
    <Tab.Navigator style={{ backgroundColor: '#fff' }}>
      <Tab.Screen name="Cars" component={Cars} />
      <Tab.Screen name="Bookings" component={BookingRequests} />
      <Tab.Screen 
        name="Analytics" 
        component={Analytics}
        initialParams={{ firstBookingDate, lastBookingDate }}
      />
    </Tab.Navigator>
  );
};

export default VendorDashboard;
