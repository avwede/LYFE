import React, { Component} from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const {width: WIDTH} = Dimensions.get('window')
const ForgotPassword = (props) => {
        return(
            <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../assets/logo4.png')}></Image>
                </View>
                <View style={{alignItems:'center', marginBottom:60}}>
                    <Text style={styles.loginText}>
                        Forgot your password? No problem!
                    </Text>
                    <Text style={styles.loginText}>
                        Enter your email, and we'll send you a link to reset your password.
                    </Text>
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
                    ></TextInput>
                </View>
                <TouchableOpacity style={styles.loginBtn}>
                    <Text style={styles.signUp} >Reset Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toLogin}
                onPress={() => props.navigation.navigate('Login')}>
                <View style={{alignContent:'center', marginTop:30}}>
                    <Text style={styles.loginText} >
                        Already have an account? Tap here.
                    </Text>
                </View>
                </TouchableOpacity>
            </LinearGradient>
        );
    }
}
export default ForgotPassword;
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