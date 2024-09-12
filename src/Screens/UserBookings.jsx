import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { AuthContext } from '../utils/AuthContext';
const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const {userData} = useContext(AuthContext)

  const fetchBookings = async () => {
    try {
      const bookingsRef = collection(db, 'booking'); 
      const bookingsQuery = query(bookingsRef, where('customerID', '==', userData.uid));

      const querySnapshot = await getDocs(bookingsQuery); // Fetch matching documents

      const bookingsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBookings(bookingsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings: ', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      {bookings.length === 0 ? (
        <Text>No bookings found</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <Text>Booking ID: {item.id}</Text>
              <Text>Customer Name: {item.customerName}</Text>
              {/* Display other booking details */}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Bookings;
