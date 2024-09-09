import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';

const BoostingDetails = () => {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('..//..//../assets/blue-sedan.jpg')} 
        style={styles.image}
        resizeMode="cover"
      >
        {/* You can replace the URL with your actual image URL or require an image locally */}
      </ImageBackground>

      <View style={styles.content}>
        <Text style={styles.title}>How boosting works</Text>
        <Text style={styles.description}>
          When you boost a car, it will be shown to more drivers on the search page.
        </Text>

        <Text style={styles.question}>How much does it cost?</Text>
        <Text style={styles.answer}>
          The price depends on how many other vendors are boosting their cars in your area. It can range from $20 - $200 per day.
        </Text>

        <Text style={styles.question}>How long does boosting last?</Text>
        <Text style={styles.answer}>
          It lasts for 24 hours and then you can extend it as long as you'd like.
        </Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Boost my car</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff',
    justifyContent:'space-between'
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').height * 0.3, // Adjust the height as needed
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  answer: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BoostingDetails;
