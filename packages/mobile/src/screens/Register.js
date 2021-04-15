import React, { useState, useContext, Component} from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { JWTProvider } from '../contexts/JWTContext';
//import { useNavigation } from '@react-navigation/native';


const {width: WIDTH} = Dimensions.get('window');

class Register extends Component{
    constructor(props) {
        super(props);
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = {};
      }
    state = {
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    }
    updateFirstName = (text) => {
        this.setState({
            firstName: text
        })
        console.log(text);
    }
    updateLastName = (text) => {
        this.setState({
            lastName: text
        })
        console.log(text);
    }
    updateEmail = (text) => {
        this.setState({
            email: text
        })
        console.log(text);
    }
    updatePassword = (text) => {
        this.setState({
            password: text
        })
        console.log(text);
    }
    registerUser = () => {
        axios.post("https://test-lyfe-deployment-v2.herokuapp.com/api/users/register", {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
    })
    .then(function(response) {
        console.log(response);
    })
    .catch(function(error){
        console.log(error);
    })
    }    
    focusNextField(id) {
    this.inputs[id].focus();
    }

    render(){
        return(
            <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../assets/logo4.png')}></Image>
                </View>
                <View style={{alignItems:'center', marginTop:30}}>
                    <TextInput
                    style={styles.inputView}
                    placeholder= 'First Name'
                    placeholderTextColor='black'
                    underlineColorAndroid='transparent'
                    returnKeyType='next'
                    blurOnSubmit={false}
                    onSubmitEditing = {() => this.focusNextField('two')}
                    ref={ input => {this.inputs['one'] = input;}}
                    onChangeText={this.updateFirstName}
                    ></TextInput>
                </View>
                <View style={{alignItems:'center'}}>
                    <TextInput
                    style={styles.inputView}
                    placeholder= 'Last Name'
                    placeholderTextColor='black'
                    underlineColorAndroid='transparent'
                    returnKeyType='next'
                    blurOnSubmit={false}
                    onSubmitEditing = {() => this.focusNextField('three')}
                    ref={ input => {this.inputs['two'] = input;}}
                    onChangeText={this.updateLastName}
                    ></TextInput>
                </View>
                <View style={{alignItems:'center'}}>
                    <TextInput
                    style={styles.inputView}
                    placeholder= 'Email'
                    placeholderTextColor='black'
                    underlineColorAndroid='transparent'
                    returnKeyType='next'
                    blurOnSubmit={false}
                    onSubmitEditing = {() => this.focusNextField('four')}
                    ref={ input => {this.inputs['three'] = input;}}
                    onChangeText={this.updateEmail}
                    ></TextInput>
                </View>
                <View style={{alignItems:'center'}}>
                    <TextInput
                    style={styles.inputView}
                    placeholder= 'Password'
                    placeholderTextColor='black'
                    underlineColorAndroid='transparent'
                    secureTextEntry={true}
                    blurOnSubmit={true}
                    ref={ input => {this.inputs['four'] = input;}}
                    onChangeText={this.updatePassword}
                    ></TextInput>
                </View>
                <TouchableOpacity style={styles.loginBtn}
                onPress={() => this.registerUser()}>
                    <Text style={styles.signUp} >Create Account</Text>
                </TouchableOpacity>
            </LinearGradient>
        );
    }
}
export default Register;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingBottom:60
    },
    logoContainer: {
        alignItems:'center',
        paddingBottom:20,
        marginTop:100
    },
    logo:{
        width: 140,
        height: 140,
    },
    inputContainer:{
        marginTop:10
    },
    inputView:{
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