import React, { useContext, useState, useReducer } from 'react';
import { StyleSheet, Text, View, Image, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './src/screens/Login.js';
import Register from './src/screens/Register.js';
import ForgotPassword from './src/screens/ForgotPassword.js';
import Dashboard from './src/screens/Dashboard.js';
import Reminders from './src/screens/Reminders.js';
import Health from './src/screens/Health.js';
import EditHealth from './src/screens/EditHealth.js'
import Classes from './src/screens/Classes.js';
import Profile from './src/screens/Profile.js';
import {JWTProvider, JWTContext}  from './src/contexts/JWTContext.js'
import { LoginContext } from './src/contexts/LoginContext.js'
import { Provider as PaperProvider} from 'react-native-paper';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/* Suppressing an unnecessary warning from datetimepicker
// Minor error in 3rd party dependency, does not affect functionality
LogBox.ignoreLogs(['Warning: Possible Unhandled Promise Rejection']);
*/

export default function App() {  
  //const [initialState, toggleInitialState] = useState(true);
  //const state = {loggedIn, toggleLoggedIn};
  /*const LoginContext = React.createContext({
    loggedIn: false,
    toggleLoggedIn: () => {},
  });
  const loginContext = useContext(LoginContext);*/

  // Not ideal to force refresh, but couldn't find any
  // other way of getting it to recognize a user logged in.
  const [token, setToken] = useState("");

  const loggedInCheck = (string) => {setToken(string); console.log(token);};

  // https://reactjs.org/docs/context.html
  return (
    <NavigationContainer>
    <PaperProvider>
    <JWTProvider>
    <LoginContext.Provider>
      {(token === "") ?
      (<Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login">
          {props => <Login {...props} updateLoggedIn={loggedInCheck} />}
        </Stack.Screen>
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Forgot Password" component={ForgotPassword} />
      </Stack.Navigator>) :
      (<Tab.Navigator initialRouteName="Dashboard">
        <Tab.Screen name="Dashboard" component={Dashboard}  />
        <Tab.Screen name="Reminders" component={Reminders}  />
        <Tab.Screen name="Health" component={EditHealth} />
        <Tab.Screen name="School" component={Classes} />
        <Tab.Screen name="Profile" >
          {props => <Profile {...props} updateLoggedIn={loggedInCheck} />}
        </Tab.Screen>
      </Tab.Navigator>)}
    </LoginContext.Provider>
    </JWTProvider>
    </PaperProvider>
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
