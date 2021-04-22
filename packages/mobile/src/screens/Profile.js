import React, { useState, useContext, Component} from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableNativeFeedback, TouchableOpacity, Dimensions} from 'react-native';
import { Overlay, Divider, Button, registerCustomIconType } from 'react-native-elements';
import { Icon } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const {width: WIDTH} = Dimensions.get('window');
const Profile = (props) => {
    const [data, setData] = useState();
    const [dob, setDob] = useState();
    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();
    const [gender, setGender] = useState();
    const [bloodType, setBloodType] = useState();
    const [visible, setVisible] = useState(false);

    const updateProfile = () => {
        setVisible(false);
        return;
    }

    /*useEffect(() => {
       getClasses();
    }, [data]); */

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
                <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                        <View><Text>Update Profile</Text></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Date of Birth (YYYY-MM-DD)'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        onChangeText={(text) => setDob(text)}
                        ></TextInput></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Height (inches)'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        onChangeText={(text) => setHeight(text)}
                        ></TextInput></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Weight (lbs)'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        onChangeText={(text) => setWeight(text)}
                        ></TextInput></View>
                        <View style={{width: WIDTH - 100,
                                        height:20,
                                        paddingLeft:12,
                                        paddingBottom: 3,
                                        fontSize: 12}}>
                        <Picker
                            mode="dropdown"
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
                                        paddingBottom: 3,
                                        fontSize: 12}}>
                        <Picker
                            mode="dropdown"
                            placeholder="Blood Type"
                            selectedValue={bloodType}
                            onValueChange={(itemValue, itemIndex) =>
                                setBloodType(itemValue)
                            }>
                                <Picker.Item label="A+" value="A+" />
                                <Picker.Item label="A-" value="A-" />
                                <Picker.Item label="AB+" value="AB+" />
                                <Picker.Item label="AB-" value="AB-" />
                                <Picker.Item label="B+" value="B+" />
                                <Picker.Item label="B-" value="B-" />
                                <Picker.Item label="O+" value="O+" />
                                <Picker.Item label="O-" value="O-" />
                                <Picker.Item label="Unknown" value="Unknown" />
                        </Picker>
                        </View>
                        <Button title="Update" onPress={() => updateProfile()}></Button>)
                        </Overlay>)
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