import React, { useState, useContext, useEffect, Component} from 'react';
import { StyleSheet, Image, TextInput, TouchableNativeFeedback, Dimensions, CheckBox} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Overlay, Divider, Button, registerCustomIconType } from 'react-native-elements';
import { Container, Header, Content, Icon, Accordion, Text, View } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';

// https://reactnative.dev/docs/flexbox

const {width: WIDTH} = Dimensions.get('window')
const {height: HEIGHT} = Dimensions.get('window')
const Reminders = (props) => {
    // Fetch tasks after each modal submission. Make sure it's async.
    // Call setData on response to store in state.
    const [deleteOverlay, setDeleteOverlay] = useState(false);
    const [addOrEdit, setAddorEdit] = useState(true);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState();
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    // This holds index in state for the edit and delete overlay. 
    const [activeIndex, setActiveIndex] = useState(Number.MIN_SAFE_INTEGER);

    // https://stackoverflow.com/questions/58925515/using-react-native-community-datetimepicker-how-can-i-display-a-datetime-picker
    const onChangeDate = (event, selectedDate) => {
        setShow(Platform.OS === 'ios');
        if (mode == 'date') {
            const currentDate = selectedDate || date;
            setDate(currentDate);
            setMode('time');
            setShow(Platform.OS !== 'ios'); 
        } else {
            const selectedTime = selectedDate || new Date();
            setTime(selectedTime);
            setShow(Platform.OS === 'ios'); 
            setMode('date'); 
        }
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    // Get data from "data" state corresponding to this index.
    // Put it into the states for the overlay.
    const editHelper = (index) => {
        setActiveIndex(index);
        setAddorEdit(false);
        setDeleteOverlay(false);
        toggleOverlay();
    }

    const deleteHelper = (index) => {
        setActiveIndex(index);
        setDeleteOverlay(true); 
        toggleOverlay();
    }

    // For the following functions, make a POST request followed
    // by a GET request to fetch the updated data, then update "data" state
    const addReminder = () => {
        return;
    }

    const editReminder = () => {

        setActiveIndex(Number.MIN_SAFE_INTEGER);
        toggleOverlay();
        return;
    }
    
    const deleteReminder = () => {

        setActiveIndex(Number.MIN_SAFE_INTEGER);
        toggleOverlay();       
        return;
    }

    const renderHeader = () => {
        return(<View style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center" ,
            backgroundColor: "#A9DAD6" }}>
          <Text style={{ fontWeight: "600" }}>
              Reminder #1
            </Text>
          </View>)
    }

    // Take in individual items once API set up
    // Accordion component should handle .map()
    // Try to set up so the item's position in array (index) is passed
    // to editHelper()
    const renderAccordion = () => {
        return(
        <View style={styles.expandedAccordion}>
        <View style={styles.textSpacing}>
            <Text>04/21/2021 06:00 PM</Text>
        </View>
        <View style={styles.textSpacing}>
            <Text>Submit POOP Large Project</Text>
        </View>
        <View style={styles.textSpacing}>
            <Text>Type: Assignment</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: "space-around"}}>
            <TouchableNativeFeedback
            onPress = {(index) => editHelper(index)}>
                <Icon type="FontAwesome5" name="edit">
                </Icon>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
            onPress = {(index) => deleteHelper(index)}>
                <Icon type="FontAwesome5" name="trash-alt">
                </Icon>
            </TouchableNativeFeedback>
        </View>
        </View>)
    }

    // https://stackoverflow.com/questions/58925515/using-react-native-community-datetimepicker-how-can-i-display-a-datetime-picker
    const formatDate = (date, time) => {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${time.getHours()}:${time.getMinutes()}`;
    };

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
                <Button title="Add Reminder" onPress = {() => {setDeleteOverlay(false); setAddorEdit(true); toggleOverlay();}} />
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
                        <View style={styles.inputView}>
                        <TouchableNativeFeedback 
                        title='Show Date Picker'
                        onPress={() => showDatepicker()}>
                            <Text>{formatDate(date, time)}</Text>
                        </TouchableNativeFeedback>
                        {show && (
                            <DateTimePicker
                                value={date}
                                display='default'
                                mode={mode}
                                onChange={onChangeDate}
                            />
                        )}
                        </View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Type'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        ></TextInput></View>
                        {addOrEdit ? (<Button title="Add" onPress={() => addReminder}></Button>) : 
                        (<Button title="Edit" onPress={() => editReminder()}></Button>)}
                        </Overlay>) :
                        (<Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                        <Text> Are you sure you want to delete this reminder? </Text>
                        <View style= {{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                            <TouchableNativeFeedback style={styles.loginBtn}
                            onPress = {() => {setActiveIndex(Number.MIN_SAFE_INTEGER); toggleOverlay();}}>
                                <Text>
                                Cancel
                                </Text>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback style={styles.loginBtn}
                            onPress = {() => deleteReminder()}>
                            <Text> Delete </Text>
                            </TouchableNativeFeedback>
                        </View>
                        </Overlay>)}
            </View>
            <View>
                <Divider />
            </View>
            <View style={styles.accordion}>
                <Accordion
                dataArray={dataArray}
                animation={true}
                icon="add"
                expandedIcon="remove"
                expanded={[]} 
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
    },
    accordion:{
        alignItems:'center', 
        marginTop: 50
    },
    expandedAccordion: {
        width: WIDTH - 90
    },
    textSpacing:{
        marginVertical: 10
    },
});