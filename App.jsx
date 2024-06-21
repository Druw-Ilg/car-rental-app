import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/Screens/HomeScreen';
import SUVScreen from './src/Screens/SUVScreen';
import SedanScreen from './src/Screens/SedanScreen';
import CarDetailsScreen from './src/Screens/CarDetailsScreen';
import SignUpScreen from './src/Screens/SignUpScreen';
import VendorScreen from './src/Screens/VendorScreen';

import CustomDrawerContent from './src/components/CustomDrawerContent';
import { AuthProvider, AuthContext } from './src/utils/AuthContext';
import VendorDrawerContent from './src/components/VendorDrawerContent';
import UserDrawerContent from './src/components/UserDrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
	return (
		<AuthProvider>
			<NavigationContainer>
				<MainStack />
			</NavigationContainer>
		</AuthProvider>
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
			<Stack.Screen name="Car" component={CarDetailsScreen} />
			<Stack.Screen name="Connexion" component={SignUpScreen} />
			<Stack.Screen name="VendorScreen" component={VendorScreen} />
		</Stack.Navigator>
	);
};

export default App;
