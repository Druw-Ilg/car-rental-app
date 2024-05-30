import 'react-native-gesture-handler';
import React, { useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/Screens/HomeScreen';
import SUVScreen from './src/Screens/SUVScreen';
import SedanScreen from './src/Screens/SedanScreen';
import CarDetailsScreen from './src/Screens/CarDetailsScreen';
import SignUpScreen from './src/Screens/SignUpScreen';
import CustomDrawerContent from './src/components/CustomDrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
	return (
		<>
			<NavigationContainer>
				<Drawer.Navigator
					drawerContent={(props) => <CustomDrawerContent {...props} />}
				>
					<Drawer.Screen
						name="HomeDrawer"
						component={HomeDrawer}
						options={{ headerShown: false }}
					/>
				</Drawer.Navigator>
			</NavigationContainer>
		</>
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
		</Stack.Navigator>
	);
};

export default App;
