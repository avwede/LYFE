import React, { useState, useContext, useEffect, Component} from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { SafeAreaView } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '@react-navigation/stack';

// Title and Button at top.
// Button goes to Overlay with TextInputs and Checkbox and submit Button.
// Has to interface with DateTimePicker and system alarm.
// Followed by Accordion list of reminders (the entire Accordion should be wrapped in View), 
// With edit and delete Icons from fontawesome.

// Call Array.from() on any json recieved so .map() can be 
// called on that.
/* example: {items.map((item) => {
        return (<Accordion item={item.title}>
                    <ComponentInsideAccordion>
                    </C>
                </A>
    })} */


const {width: WIDTH} = Dimensions.get('window')
const Reminders = (props) => {
    // Fetch tasks after each modal submission by enabling
    // a "refresh" useState. The (ASYNC) function it calls will then 
    // set "refresh" back to false.
    const [refresh, setRefresh] = useState(false);
/*  useEffect(() => {
       getReminders();
    }, []); 
    
    if (refresh) {
        getReminders();
    }*/
    
    return(
        <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style={styles.container}>
            <SafeAreaView style={{alignItems:'center', marginTop:10}}>
                <Header
                underlineColorAndroid='transparent'
                returnKeyType='next'
                >Reminders</Header>
            </SafeAreaView>
            <SafeAreaView style={{alignItems:'center'}}>
                <TextInput
                style={styles.inputSafeAreaView}
                placeholder= 'Last Name'
                placeholderTextColor='black'
                underlineColorAndroid='transparent'
                returnKeyType='next'
                blurOnSubmit={false}
                ></TextInput>
            </SafeAreaView>
            <SafeAreaView style={{alignItems:'center'}}>
                <TextInput
                style={styles.inputSafeAreaView}
                placeholder= 'Email'
                placeholderTextColor='black'
                underlineColorAndroid='transparent'
                returnKeyType='next'
                blurOnSubmit={false}
                ></TextInput>
            </SafeAreaView>
            <SafeAreaView style={{alignItems:'center'}}>
                <TextInput
                style={styles.inputSafeAreaView}
                placeholder= 'Password'
                placeholderTextColor='black'
                underlineColorAndroid='transparent'
                secureTextEntry={true}
                blurOnSubmit={true}
                ></TextInput>
            </SafeAreaView>
            <TouchableOpacity style={styles.loginBtn}>
                <Text style={styles.signUp} >Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toLogin}>
            <SafeAreaView style={{alignContent:'center', marginTop:30}}>
                <Text style={styles.loginText} >
                    Already have an account? Tap here.
                </Text>
            </SafeAreaView>
            </TouchableOpacity>
        </LinearGradient>
    );
}

export default Reminders;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    logoContainer: {
        alignItems:'center',
        paddingBottom:40,
        marginTop:70
    },
    logo:{
        width: 140,
        height: 140,
    },
    inputContainer:{
        marginTop:10
    },
    inputSafeAreaView:{
        width: WIDTH - 100,
        backgroundColor:"white",
        borderRadius:25,
        height:50,
        marginBottom:20,
        justifyContent:'center',
        paddingLeft:20,
        paddingBottom: 3,
      },
    loginBtn:{
        width: 300,
        backgroundColor:"#181414",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop: 10,
    },
    toLogin:{
        alignContent: 'center',
        marginTop:60
    },
    signUp:{
        color:'white',
        fontSize: 13,
        fontFamily: 'sans-serif',
    },
    loginText:{
        color:'black',
        fontSize: 12,
        fontFamily: 'sans-serif',
    }
});