import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { Text } from 'react-native-paper';
import Cars from './Cars'
import BookingRequests from './BookingRequests';
const Tab = createMaterialTopTabNavigator();
const VendorDashboard = () => {
   
   const Bookings =  ()=>{
    return(
        <Text> i ama Bookings section</Text>
    )

   }
   const Analytics =  ()=>{
    return(
        <Text> i am analytics section</Text>
    )

   }




  return (
    <Tab.Navigator>
    <Tab.Screen  name="Cars" component={Cars} />
    <Tab.Screen  name="Bookings" component={BookingRequests} />
    <Tab.Screen  name="Analytics" component={Analytics} />
    </Tab.Navigator>
  )
}

export default VendorDashboard