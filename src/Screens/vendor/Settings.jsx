import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
const Settings = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Settings</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Update Email</Text>
          <AntIcon name="arrowright" size={30} color="#000" /> 
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Content</Text>
        <View style={styles.option}>
          <Text style={styles.optionText}>Language</Text>
          <Text style={styles.optionValue}>English</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Push Notifications</Text>
          <AntIcon name="arrowright" size={30} color="#000" /> 
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Contact/Help Center</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
      
      <TouchableOpacity>
        <Text style={styles.deleteText}>Delete account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
  },
  optionValue: {
    fontSize: 16,
    color: '#666',
  },
  arrow: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 30,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default Settings;
