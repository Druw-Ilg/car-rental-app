import React from 'react';
import { View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './src/components/HomeScreen';
// import CustomDrawerContent from './components/CustomDrawerContent';
// import {Sedan, SUV, Auth} from './src/components/Screens';

// const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();


const App = () => {
  return (
	<View  style={{ flex: 1 }}>
      <HomeScreen />
		{/* <NavigationContainer>
		<Drawer.Navigator>
			<Drawer.Screen name="Home" component={HomeScreen} />
			<Drawer.Screen name="Sedan" component={Sedan} />
			<Drawer.Screen name="SUV" component={SUV} />
			<Drawer.Screen name="Se connecter" component={Auth} />
		</Drawer.Navigator>
		</NavigationContainer> */}
	</View>
    
  );
};

export default App;
