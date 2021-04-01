import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './src/screens/Login.js';
import Register from './src/screens/Register.js';
import ForgotPassword from './src/screens/ForgotPassword.js';
import Dashboard from './src/screens/Dashboard.js';
import Reminders from './src/screens/Reminders.js';
import Health from './src/screens/Health.js';
import School from './src/screens/School.js';
import Profile from './src/screens/Profile.js';
import {JWTProvider, JWTContext} from './src/contexts/JWTContext.js'
import { LoginContext } from './src/contexts/LoginContext.js'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {  
  const [loggedIn, toggleLoggedIn] = useState(true);
  const state = {loggedIn, toggleLoggedIn};

  // https://reactjs.org/docs/context.html
  return (
    <NavigationContainer>
    <JWTProvider>
    <LoginContext.Provider value={state}>
      {!loggedIn ?
      (<Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Forgot Password" component={ForgotPassword} />
      </Stack.Navigator>) :
      (<Tab.Navigator initialRouteName="Dashboard">
        <Tab.Screen name="Dashboard" component={Dashboard}  />
        <Tab.Screen name="Reminders" component={Reminders}  />
        <Tab.Screen name="Health" component={Health} />
        <Tab.Screen name="School" component={School} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>)}
    </LoginContext.Provider>
    </JWTProvider>
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
