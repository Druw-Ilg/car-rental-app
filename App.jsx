// import 'react-native-gesture-handler';
import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
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
import {PermissionsAndroid} from 'react-native';
import { initializeApp } from 'firebase/app';
import 'firebase/messaging';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const firebaseConfig = {
	apiKey: "AIzaSyCiJqMxVSy-ww5xVMTr2cYBkUnemVYI7bY",
	authDomain: "car-rental-backend01.firebaseapp.com",
	databaseURL: "https://car-rental-backend01-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "car-rental-backend01",
	storageBucket: "car-rental-backend01.appspot.com",
	messagingSenderId: "630901504141",
	appId: "1:630901504141:web:36fc931b88ab779dc58ac4"
  };


  // Initialize Firebase
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
  }
  
  const messaging = firebase.messaging();
const App = () => {
	useEffect(()=>{
		PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
		const requestPermission = async () => {
			try {
			  await messaging.requestPermission();
			  const token = await messaging.getToken({ vapidKey: 'BDgaHjCEuCmSb46IiPHfw19eR7UhqhOaI5ksbZJTy4mKGyAkPBqeZVNCebJGhrNcoWB01u_6Z2XF1N0CIH9HpBw' });
			  console.log('FCM Token:', token);
			} catch (error) {
			  console.error('Notification permission denied', error);
			}
		  };
	  
		  requestPermission();
	  
		  messaging.onMessage((payload) => {
			console.log('Message received: ', payload);
			// Handle the notification
		  });
	  
		  if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/firebase-messaging-sw.js')
			  .then((registration) => {
				console.log('Service Worker registered with scope:', registration.scope);
			  }).catch((error) => {
				console.error('Service Worker registration failed:', error);
			  });
		  }
	})
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
			
			<Stack.Screen name="Tableau de bord" component={VendorDashboard} 
			options={{headerTitleAlign:'center',headerTitle:'Dashboard'}}/>
			<Stack.Screen name="search" component={SearchScreen} 
			options={{headerTitleAlign:'center',headerTitle:'Search'}}/>
			<Stack.Screen name="Profile Loueur" component={VendorProfileScreen} />
			<Stack.Screen name="Booking Details" component={BookingDetails} 
		       options={{headerTitleAlign:'center',headerTitle:'Booking'}}/>
			<Stack.Screen name="Boosting Details" component={BoostingDetails} 
		       options={{headerTitleAlign:'center',headerTitle:'Boosting Your List'}}/>
			<Stack.Screen name="Settings" component={Settings} options={{headerTitle:''}}/>
			<Stack.Screen name="Profile" component={UserProfileScreen}    options={{headerTitleAlign:'center',headerTitle:'Profile'}}/>
		</Stack.Navigator>
	);
};

export default App;
