import React, { useContext, useState, useReducer } from 'react';
import { StyleSheet, Text, View, Image, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './src/screens/Login.js';
import Register from './src/screens/Register.js';
import ForgotPassword from './src/screens/ForgotPassword.js';
import ResetToken from './src/screens/ResetToken.js';
import Dashboard from './src/screens/Dashboard.js';
import Reminders from './src/screens/Reminders.js';
import Health from './src/screens/Health.js';
import EditHealth from './src/screens/EditHealth.js'
import Classes from './src/screens/Classes.js';
import Profile from './src/screens/Profile.js';
import {JWTProvider, JWTContext}  from './src/contexts/JWTContext.js'
import { LoginContext } from './src/contexts/LoginContext.js'
import { Provider as PaperProvider} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
        <Stack.Screen name="Reset Token" component={ResetToken} />
      </Stack.Navigator>) :
      (<Tab.Navigator initialRouteName="Dashboard" screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'globe-outline';
          } else if (route.name === 'Reminders') {
            iconName = 'list';
          } else if (route.name === 'Health') {
            iconName = 'medkit';
          } else if (route.name === 'School') {
            iconName = 'school';
          } else if (route.name === 'Profile') {
            iconName = 'person-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
<<<<<<< HEAD
        <Tab.Screen name="Dashboard" component={Dashboard}  />
        <Tab.Screen name="Reminders" component={Reminders}  />
        <Tab.Screen name="Health" component={EditHealth} />
        <Tab.Screen name="School" component={Classes} />
=======
        <Tab.Screen name="Dashboard" component={DashboardStackScreen}  />
        <Tab.Screen name="Reminders" component={ReminderStackScreen}  />
        <Tab.Screen name="Health" component={HealthStackScreen} />
        <Tab.Screen name="School" component={ClassesStackScreen} />
>>>>>>> 983c59e6e3e0f0d4db20752f4553175ae280e1dd
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
const HealthStack = createStackNavigator();
function HealthStackScreen () {
  return(
    <HealthStack.Navigator>
      <HealthStack.Screen name="Health Profile" component={Health} />
      <HealthStack.Screen name="Edit Health Profile" component={EditHealth} />
    </HealthStack.Navigator>
  );
}
const DashboardStack = createStackNavigator();
function DashboardStackScreen () {
  return(
    <DashboardStack.Navigator>
      <DashboardStack.Screen name="Dashboard" component={Dashboard}/>
    </DashboardStack.Navigator>
  );
}
const ReminderStack = createStackNavigator();
function ReminderStackScreen () {
  return(
  <ReminderStack.Navigator>
    <ReminderStack.Screen name="Reminders" component={Reminders}/>
  </ReminderStack.Navigator>
  );
}
const ClassesStack = createStackNavigator();
function ClassesStackScreen () {
  return(
    <ClassesStack.Navigator>
      <ClassesStack.Screen name="Classes" component={Classes}/>
    </ClassesStack.Navigator>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
