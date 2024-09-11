import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig'; 
import { useRoute } from '@react-navigation/native';
import { AuthContext } from '../utils/AuthContext';

const BookingScreen = ({route}) => {
  const { vehicle } = route.params;
 const {userData} = useContext(AuthContext)
  const user = auth.currentUser;
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(vehicle);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fullName, setFullName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [phoneNumber, setPhoneNumber] = useState(userData.phoneNumber);
  const [loading, setLoading] = useState(false);

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'vehicles'));
        const carData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCars(carData);
      } catch (error) {
        console.error("Error fetching car data: ", error);
      }
    };

    fetchCars();
  }, []);

  const handleConfirmBooking = async () => {
    if (!selectedCar || !startDate || !endDate || !fullName || !email || !phoneNumber) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, 'booking'), {
        vehicleID: selectedCar.id,
        vendorId: selectedCar.vendorId,
        customerID: user.uid,
        OwnerID: user.uid,
        bookingStatus: "pending",
        price:selectedCar.price,
        startDate,
        endDate,
        fullName,
        email,
        phoneNumber,
        bookingDate: new Date().toISOString(),
      });

      const bookingID = docRef.id;
      await updateDoc(doc(db, 'booking', bookingID), { bookingID });

      Alert.alert('Success', 'Booking Confirmed')
      
    } catch (error) {
      console.error("Error confirming booking: ", error);
      Alert.alert('Error', 'There was a problem confirming your booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date.toISOString().split('T')[0]);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date.toISOString().split('T')[0]);
    hideEndDatePicker();
  };

  const renderCarItem = ({ item }) => (
    <TouchableOpacity style={[styles.carItem, selectedCar?.id === item.id && styles.selectedCar]} onPress={() => setSelectedCar(item)}>
      <Image source={{ uri: item.imageUrls[0] }} style={styles.carImage} />
      <View style={styles.carDetails}>
        <Text style={styles.carName}>{item.brand}</Text>
        <Text style={styles.carPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subHeading}>Select Car</Text>
      <FlatList
        data={cars}
        renderItem={renderCarItem}
        keyExtractor={item => item.id}
        horizontal={false}
      />

      <Text style={styles.subHeading}>Booking Dates</Text>
      <TouchableOpacity onPress={showStartDatePicker}>
        <TextInput
          style={styles.input}
          placeholder="Start Date"
          value={startDate}
          editable={false}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={showEndDatePicker}>
        <TextInput
          style={styles.input}
          placeholder="End Date"
          value={endDate}
          editable={false}
        />
      </TouchableOpacity>

      <Text style={styles.subHeading}>Personal Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirmBooking} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Confirm Booking</Text>
        )}
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={hideStartDatePicker}
      />

      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={hideEndDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  carItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  selectedCar: {
    borderColor: '#000',
  },
  carImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  carDetails: {
    flex: 1,
  },
  carName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  carPrice: {
    fontSize: 14,
    color: '#888',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingScreen;
