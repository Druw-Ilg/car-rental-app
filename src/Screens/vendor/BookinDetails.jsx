import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';


const BookingDetails = () => {


  return (
    <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Booking Details</Text>
         <View style={styles.CardContainer}>
         <View style={styles.cardItems}>
             <View style={styles.profileImage} >
              <Image source={require('..//..//../assets/transport.png')} style={{width:30,height:30,alignSelf:'center'}}/>
             </View>
             <View>
              <Text style={styles.modelName}>Lexus ES 300h</Text>
              <Text style={styles.dateFromTo}>$100/jour</Text>
             </View>
          </View>
          <View style={styles.cardItems}>
             <View style={styles.profileImage} >
              <Image source={require('..//..//../assets/calendar.png')} style={{width:30,height:30,alignSelf:'center'}}/>
             </View>
             <View>
              <Text style={styles.modelName}>Date</Text>
              <Text style={styles.dateFromTo}>June 7,2023</Text>
             </View>
          </View>
          <View style={styles.cardItems}>
             <View style={styles.profileImage} >
              <Image source={require('..//..//../assets/time.png')} style={{width:30,height:30,alignSelf:'center'}}/>
             </View>
             <View>
              <Text style={styles.modelName}>Time</Text>
              <Text style={styles.dateFromTo}>9:00 AM</Text>
             </View>
          </View>
          <Text style={styles.header}>Client Details</Text>
          <View style={styles.cardItems}>
             <View style={[styles.profileImage,{backgroundColor:'transparent'}]} >
              <Image source={require('..//..//../assets/user-profile.jpg')} style={{width:40,height:40,alignSelf:'center',borderRadius:20,}}/>
             </View>
             <View style={{justifyContent:'center'}}>
             <Text style={{color:'#000'}}>Linda H.</Text>
             </View>
          </View>
          <View style={styles.cardItems}>
             <View style={styles.profileImage} >
              <Image source={require('..//..//../assets/telephone.png')} style={{width:30,height:30,alignSelf:'center'}}/>
             </View>
             <View style={{justifyContent:'center'}}>
             <Text style={{color:'#000'}}>415-555-5555</Text>
             </View>
          </View>
          <Text style={styles.header}>Send Messages</Text>
          <View style={[styles.cardItems,{marginBottom:2}]}>
             <View style={[styles.profileImage,{backgroundColor:'transparent'}]} >
              <Image source={require('..//..//../assets/user-profile.jpg')} style={{width:40,height:40,alignSelf:'center',borderRadius:20,}}/>
             </View>
             <View>
             <TextInput
              placeholder='write message'
              style={styles.inputstyle}
             />
            
             </View>
          </View>
     <TouchableOpacity style={styles.formBtn}> 
         <Text style={styles.txtFormBtn}>Send Message</Text>
     </TouchableOpacity>
         </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
   backgroundColor:'#fff'
  },
  header:{ 
        fontWeight:'bold',
        fontSize:17,
        marginBottom:10,
  },
  CardContainer:{
     padding:5,
     justifyContent:'space-between',
     flex :1,
     flexDirection:'column',
     gap:10,
  },
  cardItems:{
    justifyContent:'flex-start',
    gap:15,
    flex :1,
    flexDirection:'row',
    marginBottom:15
  },
 
  modelName: {
    fontWeight:'bold',
    fontSize:17,
  },
  dateFromTo:{
    fontWeight:'lihter',
    fontSize:14,
    color:'#a8aaad'
  },
  profileImage:{
    width:50,
    height:50,
    borderRadius:8,
    backgroundColor:'#ebeced',
    justifyContent:'center'
  },
  formBtn: {
    backgroundColor: 'rgb(40 52 74)',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
    fontWeight: 'bold'
},
txtFormBtn: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center'
},
inputstyle:{
    backgroundColor:'#ebeced',
     width:240,
    height:50,
    borderRadius:8,
    padding:10,
}
  
});

export default BookingDetails;
