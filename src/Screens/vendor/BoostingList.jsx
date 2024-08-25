import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BoostingList = ({ visible, onClose }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color="#000" />
          </TouchableOpacity>
          <View style={styles.container}>
            <Text style={styles.header}>Boost listing</Text>
            <Text style={styles.subHeader}>Get more eyes on your car</Text>
            <Text style={styles.description}>
              Boost your listing and get more views. Choose the package that's right for you.
            </Text>

            <TouchableOpacity
              style={[
                styles.packageOption,
                selectedPackage === 'bronze' && styles.selectedPackage,
              ]}
              onPress={() => setSelectedPackage('bronze')}
            >
              <View style={styles.textContainer}>
                <Text style={styles.packageTitle}>Bronze</Text>
                <Text style={styles.packageSubtitle}>Get 3x views</Text>
              </View>
              <Image source={require('..//..//../assets/example-boosting.jpg')} style={styles.packageImage} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.packageOption,
                selectedPackage === 'silver' && styles.selectedPackage,
              ]}
              onPress={() => setSelectedPackage('silver')}
            >
              <View style={styles.textContainer}>
                <Text style={styles.packageTitle}>Silver</Text>
                <Text style={styles.packageSubtitle}>Get 5x views</Text>
              </View>
              <Image source={require('..//..//../assets/example-boosting.jpg')} style={styles.packageImage} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.packageOption,
                selectedPackage === 'enterprise' && styles.selectedPackage,
              ]}
              onPress={() => setSelectedPackage('enterprise')}
            >
              <View style={styles.textContainer}>
                <Text style={styles.packageTitle}>Enterprise</Text>
                <Text style={styles.packageSubtitle}>Get 7x views</Text>
              </View>
              <Image source={require('..//..//../assets/example-boosting.jpg')} style={styles.packageImage} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectButtonText}>Select package</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    height: '70%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Ensure positioning is relative for the close button
  },
  container: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  },
  packageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
  },
  selectedPackage: {
    borderColor: '#007BFF',
    borderWidth: 2,
  },
  textContainer: {
    flexDirection: 'column',
  },
  packageTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  packageSubtitle: {
    fontSize: 14,
    color: 'gray',
    
  },
  packageImage: {
    width: 80,
    height: 50,
    borderRadius: 10,
    objectFit: 'contain',
  },
  selectButton: {
    marginTop: 10,
    backgroundColor: '#202731',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1, // Ensure the button is above other elements
  },
});

export default BoostingList;
