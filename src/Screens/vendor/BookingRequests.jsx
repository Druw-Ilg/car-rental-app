import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '..//..//../firebase/firebaseConfig'; // Update with the correct path

const BookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsRef = collection(db, 'booking');
        const querySnapshot = await getDocs(bookingsRef);

        const bookingList = await Promise.all(
          querySnapshot.docs.map(async (bookingDoc) => {
            const bookingData = bookingDoc.data();
            const vehicleID = bookingData.vehicleID;

            const vehicleDoc = await getDoc(doc(db, 'vehicles', vehicleID));
            if (vehicleDoc.exists()) {
              const vehicleData = vehicleDoc.data();

              return {
                id: bookingDoc.id,
                ...bookingData,
                vehicleImageUrl: vehicleData?.imageUrls?.[0] || '',
                vehiclePrice: vehicleData?.price || 'N/A',
                vehicleModel: vehicleData?.model || 'Unknown',
              };
            } else {
              console.error(`No vehicle found with ID: ${vehicleID}`);
              return {
                id: bookingDoc.id,
                ...bookingData,
                vehicleImageUrl: '',
                vehiclePrice: 'N/A',
                vehicleModel: 'Unknown',
              };
            }
          })
        );

        setBookings(bookingList);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats the date to "MM/DD/YYYY" by default
  };
  
  const handleReject = async (bookingId) => {
    try {
      await updateDoc(doc(db, 'booking', bookingId), { bookingStatus: 'rejected' });
      Alert.alert('Booking Rejected');
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      await updateDoc(doc(db, 'booking', bookingId), { bookingStatus: 'accepted' });
      Alert.alert('Booking Accepted');
    } catch (error) {
      console.error('Error accepting booking:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {bookings.length > 0 ? (
        bookings.map((booking, index) => (
          <View key={index} style={styles.bookingItem}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: booking.vehicleImageUrl }} style={styles.vehicleImage} />
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.bookingName}>{booking.fullName}</Text>
              <Text style={styles.bookingDate}>Booking Date: {formatDate(booking.bookingDate)}</Text>
              <Text style={styles.bookingModel}>Car Model: {booking.vehicleModel}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleReject(booking.id)} style={styles.rejectButton}>
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAccept(booking.id)} style={styles.acceptButton}>
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noBookingsText}>No Bookings Found</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fd',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    flex: 0.3,
  },
  vehicleImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 0.7,
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  bookingName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  bookingDate: {
    fontSize: 15,
    color: '#666',
    marginBottom: 2,
  },
  bookingModel: {
    fontSize: 15,
    color: '#666',
    marginBottom: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  rejectButton: {
    backgroundColor: '#e57373',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 5,
  },
  acceptButton: {
    backgroundColor: '#81c784',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noBookingsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 20,
  },
});

export default BookingRequests;
