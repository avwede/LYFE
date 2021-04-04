import React, { useState, useContext, useEffect, Component} from 'react';
import { StyleSheet, Image, TextInput, TouchableNativeFeedback, Dimensions, CheckBox} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Overlay, Divider, Button, registerCustomIconType } from 'react-native-elements';
import { Container, Header, Content, Icon, Accordion, Text, View } from 'native-base';

// Nest View's for alignment.
// Title and Button at top.
// Button goes to Overlay with TextInputs and Checkbox and submit Button.
// Has to interface with DateTimePicker and system alarm.
// Followed by Accordion list of reminders (the entire Accordion should be wrapped in View), 
// With edit and delete Icons from fontawesome.

// https://reactnative.dev/docs/flexbox

// Call .map() when generating
/* example: {items.map((item, index) => {
        return (<Accordion item={item.title}>
                    <ComponentInsideAccordion>
                    </C>
                </A>
    })} */

const {width: WIDTH} = Dimensions.get('window')
const {height: HEIGHT} = Dimensions.get('window')
const Reminders = (props) => {
    // Fetch tasks after each modal submission. Make sure it's async.
    // Call setData on response to store in state.
    const [deleteOverlay, setDeleteOverlay] = useState(false);
    const [addOrEdit, setAddorEdit] = useState(true);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState();

    const toggleOverlay = () => {
      setVisible(!visible);
    };

    // Get data from "data" state corresponding to this index.
    // Put it into the states for the overlay.
    const editHelper = (index) => {
        return;
    }

    // For the following functions, make a POST request followed
    // by a GET request to fetch the updated data, then update "data" state
    const addReminder = () => {
        return;
    }

    const editReminder = (index) => {
        return;
    }
    
    const deleteReminder = (index) => {
        return;
    }

    const renderHeader = (expanded) => {
        return(<View style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center" ,
            backgroundColor: "#A9DAD6" }}>
          <Text style={{ fontWeight: "600" }}>
              Reminder #1
            </Text>
            {expanded
              ? <Icon style={{ fontSize: 18 }} name="remove-circle" />
              : <Icon style={{ fontSize: 18 }} name="add-circle" />}
          </View>)
    }

    // Take in individual items once API set up
    // Accordion component should handle .map()
    const renderAccordion = () => {
        return(
        <View>
        <View>
            <Text>04/21/2021 06:00 PM</Text>
        </View>
        <View>
            <Text>Submit POOP Large Project</Text>
        </View>
        <View>
            <Text>Type: Assignment</Text>
        </View>
        <View>
            <TouchableNativeFeedback style={styles.loginBtn}
            onPress = {editHelper(0)}>
                <Text>
                    Edit
                </Text>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback style={styles.loginBtn}
            onPress = {() => {setDeleteOverlay(true); toggleOverlay();}}>
                <Text>
                    Delete
                </Text>
            </TouchableNativeFeedback>
        </View>
        </View>)
    }

    // For testing purposes
    const dataArray = [
        {title: "1"}
    ];

    /*useEffect(() => {
       getReminders();
    }, [data]); */
    
    return(
        <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style={styles.container}>
            <View style={{alignItems:'center', marginTop: 150, flexDirection:'row', 
            justifyContent: "space-between", width:WIDTH-100}}>
                <Text>
                    Reminders
                </Text>
                <Button title="Add Reminder" onPress = {() => {setDeleteOverlay(false); toggleOverlay();}} />
                    {(!deleteOverlay) ?
                        (<Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                        <View><Text>New Reminder</Text></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Name'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        ></TextInput></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Description'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        ></TextInput></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Location'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        ></TextInput></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Date and Time'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        ></TextInput></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Type'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        ></TextInput></View>
                        <View><Text>Alarm?</Text></View>
                        {addOrEdit ? (<Button title="Add" onPress={addReminder}></Button>) : 
                        (<Button title="Edit" onPress={editReminder}></Button>)}
                        </Overlay>) :
                        (<Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                        <Text> Are you sure you want to delete this reminder? </Text>
                        <TouchableNativeFeedback style={styles.loginBtn}
                        onPress = {() => {toggleOverlay();}}>
                            <Text>
                            Cancel
                            </Text>
                        </TouchableNativeFeedback>
                            <Text> Delete </Text>
                        </Overlay>)}
            </View>
            <View>
                <Divider />
            </View>
            <View style={{alignItems:'center', marginTop: 50}}>
                <Accordion
                dataArray={dataArray}
                animation={true}
                expanded={[0]}
                renderHeader={renderHeader}
                renderContent={renderAccordion}
                />            
            </View>
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
        //alignItems:"center",
        //justifyContent:"center",
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