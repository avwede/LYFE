import React, { useState, useContext, useEffect, Component} from 'react';
import { StyleSheet, Image, TextInput, TouchableNativeFeedback, TouchableOpacity, Dimensions} from 'react-native';
import { Icon, Text, View, Picker } from 'native-base';
import { Overlay, Divider, Button, registerCustomIconType } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import {JWTContext} from '../contexts/JWTContext.js'

const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');
const Profile = (props) => {
    const [data, setData] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [dob, setDob] = useState();
    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();
    const [gender, setGender] = useState();
    const [bloodType, setBloodType] = useState();
    const [visible, setVisible] = useState(false);
    const [triggerRefresh, setTriggerRefresh] = useState(false);

    const jwt = useContext(JWTContext);

    const getProfile = async () => {
        const resp = await axios.get("https://lyfe--app.herokuapp.com/api/users/",
        {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} })
        .catch((error) => console.log(error.response));
        console.log(resp.data);
        setData(resp.data);
        setGender(resp.data?.health?.gender);
        setBloodType(resp.data?.health?.bloodType);
    }

    // update health, then update user. store in data as intermediary
    const updateProfile = async () => {
        await axios.put("https://lyfe--app.herokuapp.com/api/health/", {
            "dateOfBirth": dob + "T00:00:00.000Z",
            "height": height,
            "weight": weight,
            "gender": gender,
            "bloodType": bloodType,
        },
        {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} })
        .catch((error) => console.log(error.response));
        await axios.put("https://lyfe--app.herokuapp.com/api/users/", {
            "firstName": firstName,
            "lastName": lastName,            
        },
        {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} })
        .catch((error) => console.log(error.response));
        setTriggerRefresh(!triggerRefresh);
        setVisible(false);
    }

    const logOut = async () => {
        await jwt.deleteToken(); 
        props.updateLoggedIn("");
    }

    useEffect(() => {
       getProfile();
    }, [triggerRefresh]); 

    const formatDateString = (dateOfBirth) => {
        const dateCheck = new Date(dateOfBirth);
        return `${dateCheck.getMonth() + 1}/${dateCheck.getDate()}/${dateCheck.getFullYear()}`;
    };

    return(
        <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../../assets/logo4.png')}></Image>
            </View>
            <View style={{flexDirection: "row", paddingVertical: 20}}>
                <Text style={{marginRight: 60}}>Your LYFE Info</Text>
                <TouchableNativeFeedback
                onPress = {() => setVisible(true)}>
                <Icon type="FontAwesome5" name="edit" style={styles.iconStyle}>
                </Icon>
                </TouchableNativeFeedback>
                <Overlay isVisible={visible} onBackdropPress={() => {setVisible(false); setTriggerRefresh(!triggerRefresh)}}>
                        <View><Text>Update Profile</Text></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'First Name'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        defaultValue={data?.firstName}
                        onChangeText={(text) => setFirstName(text)}
                        ></TextInput></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Last Name'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        defaultValue={data?.lastName}
                        onChangeText={(text) => setLastName(text)}
                        ></TextInput></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Height (inches)'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        defaultValue={data?.health?.height.toString()}
                        onChangeText={(text) => setHeight(text)}
                        ></TextInput></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Weight (lbs)'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        defaultValue={data?.health?.weight.toString()}
                        onChangeText={(text) => setWeight(text)}
                        ></TextInput></View>
                        <View style={{width: WIDTH - 100,
                                height:20,
                                paddingLeft:12,
                                marginBottom: 20,
                                fontSize: 12}}>
                        <Picker mode="dropdown"
                            placeholder="Gender"
                            selectedValue={gender}
                            onValueChange={(itemValue, itemIndex) =>
                                setGender(itemValue)
                            }>
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                                <Picker.Item label="Prefer not to say" value="Prefer not to say" />
                        </Picker>
                        </View>
                        <View style={{width: WIDTH - 100,
                                height:20,
                                paddingLeft:12,
                                marginBottom: 20,
                                fontSize: 12}}>
                        <Picker
                            mode="dropdown"
                            placeholder="Blood Type"
                            selectedValue={bloodType}
                            onValueChange={(itemValue, itemIndex) =>
                                setBloodType(itemValue)
                            }>
                                <Picker.Item label="Blood Type A+" value="A+" />
                                <Picker.Item label="Blood Type A-" value="A-" />
                                <Picker.Item label="Blood Type AB+" value="AB+" />
                                <Picker.Item label="Blood Type AB-" value="AB-" />
                                <Picker.Item label="Blood Type B+" value="B+" />
                                <Picker.Item label="Blood Type B-" value="B-" />
                                <Picker.Item label="Blood Type O+" value="O+" />
                                <Picker.Item label="Blood Type O-" value="O-" />
                                <Picker.Item label="Blood Type Unknown" value="Unknown" />
                        </Picker>
                        </View>
                        <Button title="Update" onPress={() => updateProfile()}></Button>
                        </Overlay>
            </View>
            <View style={styles.textSpacing}>
                <Text>Name: {data?.firstName + " " + data?.lastName} </Text>
            </View>
            <View style={styles.textSpacing}>
                <Text>Date of Birth: {formatDateString(data?.health?.dateOfBirth)}</Text>
            </View>
            <View style={styles.textSpacing}>
                <Text>Height: {data?.health?.height}</Text>
            </View>
            <View style={styles.textSpacing}>
                <Text>Weight: {data?.health?.weight}</Text>
            </View>
            <View style={styles.textSpacing}>
                <Text>Gender: {data?.health?.gender}</Text>
            </View>
            <View style={styles.textSpacing}>
                <Text>Blood Type: {data?.health?.bloodType}</Text>
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={() => logOut()}>
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
        height: HEIGHT,
    },
    logoContainer: {
        alignItems:'center',
        paddingRight: 40,
        //paddingVertical: 50,
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
        marginBottom: 0
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