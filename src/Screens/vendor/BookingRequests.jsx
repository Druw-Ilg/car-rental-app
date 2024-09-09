import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';


const BookingRequests = ({navigation}) => {


  return (
    <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Booking Requests</Text>
         <View style={styles.CardContainer}>
             
             <View style={styles.cardItems}>
             <View>
              <Text style={styles.modelName}>Lexus ES 300h</Text>
              <Text style={styles.dateFromTo}>Fri, Dec 30 - Sun , Jan 1</Text>
             </View>
             <View>
              <TouchableOpacity style={styles.viewDetialsButton} 
                  onPress={()=>{ navigation.navigate('Booking Details')}}>
                        <Text>View Details</Text>
             </TouchableOpacity>
             </View>
         </View>
         
              
         <View style={[styles.cardItems,{marginBottom:7}]}>
             <View>
           <Image source={require('..//..//../assets/user-profile.jpg')} style={styles.profileImage}/>
              
             </View>
             <View>
              <Text style={styles.personName}>Xyz Name</Text>
             </View>
             <View>
              <TouchableOpacity style={styles.viewDetialsButton}>
                        <Text>Reject</Text>
             </TouchableOpacity>
             </View>
             <View>
              <TouchableOpacity style={[styles.viewDetialsButton,{backgroundColor:'#4d8eff'}]}>
                        <Text style={{color:'#fff'}}>Accept</Text>
             </TouchableOpacity>
             </View>
            
         </View>
         <Text style={styles.dateFromTo}>Request Sent on Monday, Dec 30 </Text>
    
           
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
        fontSize:25,
        marginBottom:20
  },
  CardContainer:{
     padding:5,
     justifyContent:'space-between',
     flex :1,
     flexDirection:'column'
  },
  cardItems:{
    justifyContent:'space-between',
    flex :1,
    flexDirection:'row',
    marginBottom:20
  },
  viewDetialsButton :{
        paddingHorizontal:20,
        paddingVertical:5,
        borderRadius:20,
        backgroundColor:'#ebeced',
        alignSelf:'center'
  },
  modelName: {
    fontWeight:'bold',
    fontSize:17,
    marginBottom:4,
  },
  dateFromTo:{
    fontWeight:'lihter',
    fontSize:14,
    color:'#a8aaad'
  },
  profileImage:{
    width:30,
    height:30,
    borderRadius:20
  },
  personName:{
    fontWeight:'bold',
    fontSize:13,
    marginHorizontal:3,
  },
  
  
});

export default BookingRequests;
