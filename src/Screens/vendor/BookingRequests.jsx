import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { db } from '..//..//../firebase/firebaseConfig';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { AuthContext } from '..//../utils/AuthContext';

const BookingRequests = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsQuery = query(collection(db, "booking"), where("vendorId", "==", userData.uid));
        const querySnapshot = await getDocs(bookingsQuery);
        const fetchedBookings = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const bookingData = doc.data();
            const avatarQuery = query(collection(db, "avatar"), where("userId", "==", bookingData.customerID));
            const avatarSnapshot = await getDocs(avatarQuery);
            const avatarUrl = avatarSnapshot.docs.length > 0 ? avatarSnapshot.docs[0].data().downloadUrl : null;

            return {
              id: doc.id,
              ...bookingData,
              avatarUrl, // Add avatarUrl to the booking data
            };
          })
        );

        setBookings(fetchedBookings);
        setLoading(false);
      } catch (error) {
        Alert.alert("Error", "Failed to load bookings.");
        setLoading(false);
      }
    };

    if (userData && userData.uid) {
      fetchBookings();
    }
  }, [userData]);

  const handleAccept = async (bookingId) => {
    try {
      const bookingRef = doc(db, 'booking', bookingId);
      await updateDoc(bookingRef, {
        bookingStatus: 'accepted',
      });
      Alert.alert("Success", "Booking has been accepted.");
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, bookingStatus: 'accepted' } : b));
    } catch (error) {
      Alert.alert("Error", "Failed to accept booking.");
    }
  };

  const handleReject = async (bookingId) => {
    try {
      const bookingRef = doc(db, 'booking', bookingId);
      await updateDoc(bookingRef, {
        bookingStatus: 'rejected',
      });
      Alert.alert("Success", "Booking has been rejected.");
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, bookingStatus: 'rejected' } : b));
    } catch (error) {
      Alert.alert("Error", "Failed to reject booking.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const formatBookingDate = (bookingDate) => {
    const date = new Date(bookingDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Booking Requests</Text>
      {bookings.length > 0 ? (
        bookings.map((booking) => {
          const isAccepted = booking.bookingStatus === 'accepted';
          const isRejected = booking.bookingStatus === 'rejected';
          return (
            <View key={booking.id} style={styles.CardContainer}>
              <View style={styles.cardItems}>
                <Text style={styles.dateFromTo}>{`${booking.startDate} - ${booking.endDate}`}</Text>
                <TouchableOpacity
                  style={styles.viewDetialsButton}
                  onPress={() => navigation.navigate('Booking Details', { bookingId: booking.id, avatar: booking.avatarUrl })}
                >
                  <Text>View Details</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.cardItems, { marginBottom: 7 ,
                justifyContent:isAccepted || isRejected ? 'flex-start':'space-between',gap:isAccepted || isRejected ?10:0}]}>
                <View style={{flex:.6,justifyContent:'flex-start',flexDirection:'row',gap:10,alignItems:'center'}}>
                {booking.avatarUrl ? (
                  <Image source={{ uri: booking.avatarUrl }} style={styles.profileImage} />
                ) : (
                  <Image source={require('..//..//..//assets/user-profile.jpg')} style={styles.profileImage} />
                )}
                <Text style={styles.personName}>{booking.fullName}</Text>
                </View>
                {!isAccepted && !isRejected && (
                  <>
                    <TouchableOpacity
                      style={[styles.viewDetialsButton, { backgroundColor: '#ebeced' }]}
                      onPress={() => handleReject(booking.id)}
                    >
                      <Text style={{ color: '#000' }}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.viewDetialsButton, { backgroundColor: '#4d8eff' }]}
                      onPress={() => handleAccept(booking.id)}
                    >
                      <Text style={{ color: '#fff', }}>Accept</Text>
                    </TouchableOpacity>
                  </>
                )}
                {isRejected && (
                  <TouchableOpacity
                    style={[styles.viewDetialsButton, { backgroundColor: '#fa6055' ,marginHorizontal:'auto'}]}
                    disabled
                  >
                    <Text style={{ color: '#fff' }}>Rejected</Text>
                  </TouchableOpacity>
                )}
                {isAccepted && (
                  <TouchableOpacity
                    style={[styles.viewDetialsButton, { backgroundColor: '#50b379' ,marginHorizontal:'auto'}]}
                    disabled
                  >
                    <Text style={{ color: '#fff' }}>Accepted</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.dateFromTo}>Request Sent on {formatBookingDate(booking.bookingDate)}</Text>
            </View>
          );
        })
      ) : (
        <Text>No bookings available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 20,
  },
  CardContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 15,
  },
  cardItems: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 20,
  },
  viewDetialsButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#ebeced',
  },
  dateFromTo: {
    fontSize: 14,
    color: '#a8aaad',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  personName: {
    fontWeight: 'bold',
    fontSize: 13,
    marginHorizontal: 3,
  },
});

export default BookingRequests;
