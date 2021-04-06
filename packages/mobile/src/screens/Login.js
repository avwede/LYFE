import React, { useState, useContext, Component} from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
//import { useNavigation } from '@react-navigation/native';

const {width: WIDTH} = Dimensions.get('window');
//const navigation = useNavigation();

class Login extends Component{
    constructor(props) {
        super(props);
    
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = {};
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
                        ></TextInput>
                        <TouchableOpacity style={styles.forgotPos} 
                        onPress={() => this.props.navigation.navigate('Forgot Password')}>
                            <Text style={styles.forgotText}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.loginBtn}>
                            <Text style={styles.loginText}>
                                Sign in
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
