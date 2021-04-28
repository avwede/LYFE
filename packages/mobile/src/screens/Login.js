import React, { useState, useContext, Component} from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { JWTContext } from '../contexts/JWTContext.js'

const {width: WIDTH} = Dimensions.get('window');

class Login extends Component{
    static contextType = JWTContext;
    constructor(props) {
        super(props);
    
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = {};
      }

    focusNextField(id) {
        this.inputs[id].focus();
    }
    state = {
        email: "",
        password: "",
        errorCheck: false,
        errorMsg: ""
    }
    updateEmail = (text) => {
        this.setState({
            email: text
        })
    }
    updatePassword = (text) => {
        this.setState({
            password: text
        })
    }
    storeJWT = async (token) => {
        await this.context.setToken(token);
        console.log(await this.context.getToken());
        this.props.updateLoggedIn();
    }
    // Store token if successful login
    loginUser = () => {
        axios.post("https://lyfe--app.herokuapp.com/api/users/login", {
            email: this.state.email,
            password: this.state.password,
    })
    .then((response) => {
        console.log(response.data.token);
        this.storeJWT(response.data.token);
    })
    .catch((error) => {
        console.log(error);
        console.log(error.response.data.error);
        this.setState({
            errorCheck: true,
            errorMsg: error.response.data.error
        });
    })        
    }
        render(){
            return(
                <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style={styles.container}>
                    <View style={styles.logoContainer}>
                        <Image style={styles.logo} source={require('../../assets/logo4.png')}></Image>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <TextInput
                        style={styles.inputView}
                        placeholder= 'Email'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        onSubmitEditing = {() => this.focusNextField('two')}
                        ref={ input => {this.inputs['one'] = input;}}
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
                        ref={ input => {this.inputs['two'] = input;}}
                        onChangeText={this.updatePassword}
                        ></TextInput>
                        {this.state.errorCheck && <View>
                            <Text>Error! {this.state.errorMsg}</Text>
                        </View>}
                        <TouchableOpacity style={styles.forgotPos} 
                        onPress={() => this.props.navigation.navigate('Forgot Password')}>
                            <Text style={styles.forgotText}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.loginBtn} onPress={() => this.loginUser()}>
                            <Text style={styles.loginText}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.loginBtn}
                        onPress={() => this.props.navigation.navigate('Register')}>
                            <Text style={styles.loginText}>
                                Register
                            </Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            );
        }
    }

export default Login;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    logoContainer: {
        alignItems:'center',
        paddingBottom:50,
        marginBottom:30
    },
    logo:{
        width: 140,
        height: 140,
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
    loginText:{
        color:'white',
        fontSize: 13,
        fontFamily: 'sans-serif',
    },
    forgotPos:{
        paddingBottom: 5,
        paddingLeft: 170
    },
    forgotText:{
        color:'black',
        fontSize: 11,
    }
});
