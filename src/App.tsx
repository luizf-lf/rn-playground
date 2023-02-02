import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import CustomAppBar from './components/CustomAppBar';
import CustomDrawerContent from './components/CustomDrawerContent';
import { StatusBar } from 'react-native';
import { appColors } from './constants/colors';

const Drawer = createDrawerNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={appColors.shadow} />
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          header: CustomAppBar,
        }}
        drawerContent={CustomDrawerContent}>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
