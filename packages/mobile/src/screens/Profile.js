import React, { useState, useContext, Component} from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableNativeFeedback, TouchableOpacity, Dimensions} from 'react-native';
import { Icon } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';

const {width: WIDTH} = Dimensions.get('window');
const Profile = (props) => {

    const editHelper = (index) => {
        return;
    }

    return(
        <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../../assets/logo4.png')}></Image>
            </View>
            <View style={{flexDirection: "row", paddingVertical: 20}}>
                <Text style={{marginRight: 60}}>Your LYFE Info</Text>
                <TouchableNativeFeedback 
                onPress = {(index) => editHelper(index)}>
                <Icon type="FontAwesome5" name="edit" style={styles.iconStyle}>
                </Icon>
            </TouchableNativeFeedback>
            </View>
            <View style={styles.textSpacing}>
                <Text>Date of Birth:</Text>
            </View>
            <View style={styles.textSpacing}>
                <Text>Height:</Text>
            </View>
            <View style={styles.textSpacing}>
                <Text>Weight:</Text>
            </View>
            <View style={styles.textSpacing}>
                <Text>Gender:</Text>
            </View>
            <View style={styles.textSpacing}>
                <Text>Blood Type:</Text>
            </View>
            <TouchableOpacity style={styles.loginBtn}>
                <Text style={styles.signUp} >Log Out</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
}

export default Profile;
const styles = StyleSheet.create({
    container: {
        //flex: 1,
        //alignItems: 'center',
        paddingLeft: 40,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    logoContainer: {
        alignItems:'center',
        paddingRight: 40,
        paddingVertical: 50,
    },
    logo:{
        width: 100,
        height: 100,
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
        backgroundColor:"#FF0000",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop: 50,
        marginBottom: 150
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
    },
    textSpacing:{
        //alignItems: 'center',
        //marginLeft: 60,
        marginVertical: 10
    },
    iconStyle:{
        marginLeft: 100
    }
});