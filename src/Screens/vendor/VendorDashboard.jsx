import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Cars from './Cars';
import BookingRequests from './BookingRequests';
import Analytics from './Analytics';
const Tab = createMaterialTopTabNavigator();
const VendorDashboard = () => {
	return (
		<Tab.Navigator>
			<Tab.Screen name="Cars" component={Cars} />
			<Tab.Screen name="Bookings" component={BookingRequests} />
			<Tab.Screen name="Analytics" component={Analytics} />
		</Tab.Navigator>
	);
};

export default VendorDashboard;
