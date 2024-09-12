import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '..//..//../firebase/firebaseConfig'; // Assuming firebaseConfig is correctly set up

const BookingDetails = ({ navigation }) => {
  const route = useRoute();
  const { bookingId,avatar } = route.params;
  const [bookingDetails, setBookingDetails] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState(null); // State for vehicle details
  const [loading, setLoading] = useState(true);

  const formatBookingDate = (bookingDate) => {
    const date = new Date(bookingDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatBookingTime = (bookingDate) => {
    const date = new Date(bookingDate);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const bookingRef = doc(db, 'booking', bookingId);
        const bookingSnap = await getDoc(bookingRef);

        if (bookingSnap.exists()) {
          const bookingData = bookingSnap.data();
          setBookingDetails(bookingData);

          // Fetch vehicle details using vehicleID from booking details
          const vehicleRef = doc(db, 'vehicles', bookingData.vehicleID);
          const vehicleSnap = await getDoc(vehicleRef);

          if (vehicleSnap.exists()) {
            setVehicleDetails(vehicleSnap.data());
          } else {
            console.log("No vehicle found!");
          }
        } else {
          console.log("No such document!");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching booking details: ", error);
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Booking Details</Text>
      {bookingDetails ? (
        <View style={styles.CardContainer}>
          <View style={styles.cardItems}>
            <View style={styles.profileImage}>
              <Image source={require('..//..//../assets/transport.png')} style={{ width: 30, height: 30, alignSelf: 'center' }} />
            </View>
            <View>
              <Text style={styles.modelName}>{vehicleDetails?.brand  || 'Lexus ES 300h'}{vehicleDetails?.model  || 'Lexus ES 300h'}</Text>
              <Text style={styles.dateFromTo}>{`${vehicleDetails?.price}/jour`}</Text>
            </View>
          </View>
          <View style={styles.cardItems}>
            <View style={styles.profileImage}>
              <Image source={require('..//..//../assets/calendar.png')} style={{ width: 30, height: 30, alignSelf: 'center' }} />
            </View>
            <View>
              <Text style={styles.modelName}>Date</Text>
              <Text style={styles.dateFromTo}>{formatBookingDate(bookingDetails.bookingDate)}</Text>
            </View>
          </View>
          <View style={styles.cardItems}>
            <View style={styles.profileImage}>
              <Image source={require('..//..//../assets/time.png')} style={{ width: 30, height: 30, alignSelf: 'center' }} />
            </View>
            <View>
              <Text style={styles.modelName}>Time</Text>
              <Text style={styles.dateFromTo}>{formatBookingTime(bookingDetails.bookingDate)}</Text>
            </View>
          </View>

          {/* Client Details */}
          <Text style={styles.header}>Client Details</Text>
          <View style={styles.cardItems}>
            <View style={[styles.profileImage, { backgroundColor: 'transparent' }]}>
              <Image source={{uri:avatar}} style={{ width: 40, height: 40, alignSelf: 'center', borderRadius: 20 }} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ color: '#000' }}>{bookingDetails.fullName || 'Linda H.'}</Text>
            </View>
          </View>
          <View style={styles.cardItems}>
            <View style={styles.profileImage}>
              <Image source={require('..//..//../assets/telephone.png')} style={{ width: 30, height: 30, alignSelf: 'center' }} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ color: '#000' }}>{bookingDetails.phoneNumber || '415-555-5555'}</Text>
            </View>
          </View>

          {/* Send Messages Section */}
          <Text style={styles.header}>Send Messages</Text>
          <View style={[styles.cardItems, { marginBottom: 2 }]}>
            <View style={[styles.profileImage, { backgroundColor: 'transparent' }]}>
              <Image source={{uri:avatar}} style={{ width: 40, height: 40, alignSelf: 'center', borderRadius: 20 }} />
            </View>
            <View>
              <TextInput placeholder='write message' style={styles.inputstyle} />
            </View>
          </View>
          <TouchableOpacity style={styles.formBtn}>
            <Text style={styles.txtFormBtn}>Send Message</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>No booking details found.</Text>
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
    fontSize: 17,
    marginBottom: 10,
  },
  CardContainer: {
    padding: 5,
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'column',
    gap: 10,
  },
  cardItems: {
    justifyContent: 'flex-start',
    gap: 15,
    flex: 1,
    flexDirection: 'row',
    marginBottom: 15,
  },
  modelName: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  dateFromTo: {
    fontWeight: 'lighter',
    fontSize: 14,
    color: '#a8aaad',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#ebeced',
    justifyContent: 'center',
  },
  formBtn: {
    backgroundColor: 'rgb(40 52 74)',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
    fontWeight: 'bold',
  },
  txtFormBtn: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  inputstyle: {
    backgroundColor: '#ebeced',
    width: 240,
    height: 50,
    borderRadius: 8,
    padding: 10,
  },
  vehicleText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
  }
});

export default BookingDetails;
