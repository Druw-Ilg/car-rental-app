// import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MenuProvider } from 'react-native-popup-menu';

//////// Screens //////////
import {
	HomeScreen,
	SUVScreen,
	SedanScreen,
	CarDetailsScreen,
	SignUpScreen,
	VendorDashboard,
	VendorProfileScreen,
	UserProfileScreen,
	PasswordRecoveryScreen,
	BookingDetails,
	BookingScreen,
	BookingRequests,
	BoostingDetails,
	VendorSettings,
	OtherSettings,
	UserSettings,
	SearchScreen
} from './src/Screens/';

//**** Components *********/
import CustomDrawerContent from './src/components/CustomDrawerContent';
import VendorDrawerContent from './src/components/VendorDrawerContent';
import UserDrawerContent from './src/components/UserDrawerContent';

//****** Utils ************/
import { AuthProvider, AuthContext } from './src/utils/AuthContext';
import {
	AntDesign,
	MaterialCommunityIcons,
	Ionicons,
	FontAwesome
} from 'react-native-vector-icons';

const Tab = createBottomTabNavigator();
const screenOptions = {
	headerShown: false,
	tabBarInactiveTintColor: '#000',
	tabBarShowlabel: false,
	tabBarStyle: {
		backgroundColor: '#fff',
		borderTopWidth: 0,
		elevation: 0
	}
};
const Stack = createStackNavigator();

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

const MainStack = () => {
	return (
		<Tab.Navigator screenOptions={screenOptions}>
			<Tab.Screen
				name="Home"
				component={HomeStack}
				options={{
					tabBarShowLabel: false,
					tabBarIcon: ({ focused }) => {
						return focused ? (
							<MaterialCommunityIcons
								name="home-circle"
								size={32}
								color={'rgb(40 52 74)'}
							/>
						) : (
							<AntDesign name="home" size={32} color={'#ccc'} />
						);
					}
				}}
			/>
			<Tab.Screen
				name="Search"
				component={SearchScreen}
				options={{
					tabBarShowLabel: false,
					tabBarIcon: ({ focused }) => {
						return focused ? (
							<Ionicons
								name="search-circle"
								size={32}
								color={'rgb(40 52 74)'}
							/>
						) : (
							<Ionicons name="search" size={32} color={'#ccc'} />
						);
					}
				}}
			/>

			<Tab.Screen
				name="User"
				component={UserStack}
				options={{
					tabBarShowLabel: false,
					tabBarIcon: ({ focused }) => {
						return focused ? (
							<FontAwesome
								name="user-circle"
								size={32}
								color={'rgb(40 52 74)'}
							/>
						) : (
							<FontAwesome name="user-o" size={32} color={'#ccc'} />
						);
					}
				}}
			/>
		</Tab.Navigator>
	);
};

const HomeStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="HomeScreen"
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
		</Stack.Navigator>
	);
};

const UserStack = () => {
	// identify the menu to display when users are loged in or not
	const { userData } = useContext(AuthContext);

	return (
		<Stack.Navigator>
			<Stack.Screen
				name="UserScreen"
				component={
					userData && userData.isVendor
						? VendorDrawerContent
						: userData && !userData.isVendor
							? UserDrawerContent
							: CustomDrawerContent
				}
				options={{ headerShown: false }}
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
				options={{ headerTitleAlign: 'center', headerTitle: 'Booking' }}
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
				name="VendorSettings"
				component={VendorSettings}
				options={{ headerTitle: '' }}
			/>
			<Stack.Screen
				name="UserSettings"
				component={UserSettings}
				options={{ headerTitle: '' }}
			/>
			<Stack.Screen
				name="OtherSettings"
				component={OtherSettings}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Profile"
				component={UserProfileScreen}
				options={{ headerTitleAlign: 'center', headerTitle: 'Profile' }}
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
		</Stack.Navigator>
	);
};

export default App;
