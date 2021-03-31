import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SecureStore from 'expo-secure-store';
import Login from './src/screens/Login.js';
import Register from './src/screens/Register.js';
import ForgotPassword from './src/screens/ForgotPassword.js';
import Dashboard from './src/screens/Dashboard.js';
import Reminders from './src/screens/Reminders.js';
import Health from './src/screens/Health.js';
import School from './src/screens/School.js';
import Profile from './src/screens/Profile.js';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [loggedIn, toggleLoggedIn] = React.useState(0);
  
  const onLogin = async (string) => {
      await SecureStore.setItemAsync('jwt', string);
      toggleLoggedIn(!loggedIn);
    }

  const getToken = () =>  SecureStore.getItemAsync('jwt');
  
  return (
    <NavigationContainer>
      {!loggedIn ?
      (<Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} onLogin={onLogin}/>
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Forgot Password" component={ForgotPassword} />
      </Stack.Navigator>) :
      (<Tab.Navigator initialRouteName="Dashboard">
        <Tab.Screen name="Dashboard" component={Dashboard} getToken={getToken} />
        <Tab.Screen name="Reminders" component={Reminders} getToken={getToken} />
        <Tab.Screen name="Health" component={Health} getToken={getToken}/>
        <Tab.Screen name="School" component={School} getToken={getToken}/>
        <Tab.Screen name="Profile" component={Profile} getToken={getToken}/>
      </Tab.Navigator>)}
    </NavigationContainer>
  );
}

/*     <View style={styles.container}>
<Image source= {require('./assets/logo.png')} />
<StatusBar style="auto" />
</View> **/


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
