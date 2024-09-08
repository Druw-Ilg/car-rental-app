// import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/Screens/HomeScreen';
import SUVScreen from './src/Screens/SUVScreen';
import SedanScreen from './src/Screens/SedanScreen';
import CarDetailsScreen from './src/Screens/CarDetailsScreen';
import SignUpScreen from './src/Screens/SignUpScreen';

import CustomDrawerContent from './src/components/CustomDrawerContent';
import { AuthProvider, AuthContext } from './src/utils/AuthContext';
import VendorDrawerContent from './src/components/VendorDrawerContent';
import UserDrawerContent from './src/components/UserDrawerContent';
import VendorProfileScreen from './src/Screens/vendor/VendorProfileScreen';
import UserProfileScreen from './src/Screens/member/UserProfileScreen';
import PasswordRecoveryScreen from './src/Screens/PasswordRecoveryScreen';
import BookingScreen from './src/Screens/BookingScreen';
import BookingRequests from './src/Screens/vendor/BookingRequests';
import VendorDashboard from './src/Screens/vendor/VendorDashboard';
import { MenuProvider } from 'react-native-popup-menu';
import BookingDetails from './src/Screens/vendor/BookinDetails';
import BoostingDetails from './src/Screens/vendor/BoostingDetails';
import Settings from './src/Screens/vendor/Settings';
import SearchScreen from './src/Screens/SearchScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
// const Tab = createBottomTabNavigator();

const App = () => {
	return (
		<MenuProvider>
			<AuthProvider>
				<NavigationContainer>
					<MainStack />
				</NavigationContainer>
			</AuthProvider>
		</MenuProvider>
	);
};

// identify the menu to display when users are loged in or not
const MainStack = () => {
	const { userData } = useContext(AuthContext);
	return (
		<Drawer.Navigator
			drawerContent={(props) =>
				userData && userData.isVendor ? (
					<VendorDrawerContent {...props} />
				) : userData && !userData.isVendor ? (
					<UserDrawerContent {...props} />
				) : (
					<CustomDrawerContent {...props} />
				)
			}
		>
			<Drawer.Screen
				name="HomeDrawer"
				component={HomeDrawer}
				options={{ headerShown: false }}
			/>
		</Drawer.Navigator>
	);
};

const HomeDrawer = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Home"
				component={HomeScreen}
				options={{ headerShown: false }}
			/>

			<Stack.Screen name="SUV" component={SUVScreen} />
			<Stack.Screen name="Sedan" component={SedanScreen} />
			<Stack.Screen
				name="CarDetails"
				component={CarDetailsScreen}
				options={{ title: '' }}
			/>
			<Stack.Screen name="Connexion" component={SignUpScreen} />
			<Stack.Screen
				name="PasswordRecovery"
				component={PasswordRecoveryScreen}
				options={{
					title: ''
				}}
			/>
			<Stack.Screen
				name="Booking"
				component={BookingScreen}
				options={{ title: '' }}
			/>
			<Stack.Screen
				name="Booking Requests"
				component={BookingRequests}
				options={{ title: '' }}
			/>

			<Stack.Screen
				name="Tableau de bord"
				component={VendorDashboard}
				options={{ headerTitleAlign: 'center', headerTitle: 'Dashboard' }}
			/>
			<Stack.Screen name="Profile Loueur" component={VendorProfileScreen} />
			<Stack.Screen
				name="Booking Details"
				component={BookingDetails}
				options={{ headerTitleAlign: 'center', headerTitle: 'Booking#123' }}
			/>
			<Stack.Screen
				name="Boosting Details"
				component={BoostingDetails}
				options={{
					headerTitleAlign: 'center',
					headerTitle: 'Boosting Your List'
				}}
			/>
			<Stack.Screen
				name="Settings"
				component={Settings}
				options={{ headerTitle: '' }}
			/>
			<Stack.Screen name="Profile" component={UserProfileScreen} />
			<Stack.Screen
				name="search"
				component={SearchScreen}
				options={{ headerTitle: '' }}
			/>
		</Stack.Navigator>
	);
};

// const TabNavigator = () => {
// 	return (
// 		<NavigationContainer>
// 			<Tab.Navigator>
// 				<Tab.Screen name="Home" component={HomeScreen} />
// 			</Tab.Navigator>
// 		</NavigationContainer>
// 	);
// };

export default App;
