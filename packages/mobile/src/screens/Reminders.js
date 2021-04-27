import React, { useState, useContext, useEffect, Component} from 'react';
import { StyleSheet, Image, TextInput, TouchableNativeFeedback, Dimensions, CheckBox} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Overlay, Divider, Button, registerCustomIconType } from 'react-native-elements';
import { Container, Header, Content, Icon, Accordion, Text, View, Item } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import {JWTContext} from '../contexts/JWTContext.js'

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
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [location, setLocation] = useState();
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [type, setType] = useState();
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    // This holds index in state for the edit and delete overlay. 
    const [activeIndex, setActiveIndex] = useState(Number.MIN_SAFE_INTEGER);
    const [triggerRefresh, setTriggerRefresh] = useState(false);

    const jwt = useContext(JWTContext);

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
        setName(data[index].name);
        setDescription(data[index].description);
        setLocation(data[index].location.location);
        setDate(new Date(data[index].startDate));
        setTime(new Date(data[index].startDate));
        setAddorEdit(false);
        setDeleteOverlay(false);
        toggleOverlay();
    }

    const deleteHelper = (index) => {
        console.log(index);
        setActiveIndex(index);
        console.log(activeIndex);
        //console.log(data[activeIndex]._id);
        setDeleteOverlay(true);
        toggleOverlay();
    }
 
    // For the following functions, make a POST request followed
    // by a GET request to fetch the updated data, then update "data" state
    // Pass params and headers
    // Wrap in try/catch to get error messages
    const addReminder = async () => {
        console.log(name);
        console.log(description);
        console.log(type);
        console.log(location);
        console.log(time);
        const response = await axios.post("https://lyfe--app.herokuapp.com/api/reminders", {
            "name": name,
            "description": description,
            //"type": type,
            "location": {
                "type": "Classroom Location",
                "location": location
              },
            "startDate": time,
          }, {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} })
          .catch((error) => console.log(error.response.data.error));
        //setData(response.data);
        setTriggerRefresh(!triggerRefresh);
        toggleOverlay();
    }

    const getReminders = async () => {
        const resp = await axios.get("https://lyfe--app.herokuapp.com/api/reminders", 
        {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} });
        setData(resp.data.sort(function compare(a, b) {
            var dateA = new Date(a.startDate);
            var dateB = new Date(b.startDate);
            return dateA - dateB;
          }));
        console.log(data);
    }

    // get ID from data
    const editReminder = async () => {
        await axios.put(`https://lyfe--app.herokuapp.com/api/reminders/${data[activeIndex]._id}`, {
            "name": name,
            "description": description,
            //"type": type,
            "location": {
                "type": "Classroom Location",
                "location": location
              },
            "startDate": time,
          }, {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} })
          .catch((error) => console.log(error.response.data.error));;
        setActiveIndex(Number.MIN_SAFE_INTEGER);
        setTriggerRefresh(!triggerRefresh);
        toggleOverlay();
    }
    
    const deleteReminder = async () => {
        console.log(activeIndex);
        await axios.delete(`https://lyfe--app.herokuapp.com/api/reminders/${data[activeIndex]._id}`,
        {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'}})
        .catch((error) => console.log(error.response.data.error));
        setActiveIndex(Number.MIN_SAFE_INTEGER);
        setTriggerRefresh(!triggerRefresh);
        toggleOverlay();
    }

    const renderHeader = (item) => {
        return(<View style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center" ,
            backgroundColor: "#A9DAD6" }}>
            <Text style={{ fontWeight: "600" }}>
              {item.name}
            </Text>
          </View>)
    }

    // Take in individual items once API set up
    // Accordion component should handle .map()
    // Try to set up so the item's position in array (index) is passed
    // to editHelper()
    const renderAccordion = (item, index) => {
        return(
        <View style={styles.expandedAccordion}>
        <View style={styles.textSpacing}>
            <Text>{formatDateString(index)}</Text>
        </View>
        <View style={styles.textSpacing}>
            <Text>{item.description}</Text>
        </View>
        <View style={styles.textSpacing}>
            <Text>Type: {item.type}</Text>
        </View>
        <View style={styles.textSpacing}>
            <Text>Location: {item.location.location}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: "space-around"}}>
            <TouchableNativeFeedback
            onPress = {() => editHelper(index)}>
                <Icon type="FontAwesome5" name="edit">
                </Icon>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
            onPress = {() => deleteHelper(index)}>
                <Icon type="FontAwesome5" name="trash-alt">
                </Icon>
            </TouchableNativeFeedback>
        </View>
        </View>);
    }

    // https://stackoverflow.com/questions/58925515/using-react-native-community-datetimepicker-how-can-i-display-a-datetime-picker
    const formatDate = (date, time) => {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`;
    };

    const formatDateString = (index) => {
        const dateCheck = new Date(data[index].startDate);

        return `${dateCheck.getMonth() + 1}/${dateCheck.getDate()}/${dateCheck.getFullYear()} ${dateCheck.getHours()}:${dateCheck.getMinutes() < 10 ? '0' + dateCheck.getMinutes() : dateCheck.getMinutes()}`;
    }

    useEffect(() => {
       getReminders();
    }, [triggerRefresh]);
    
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
                        defaultValue={addOrEdit ? undefined : name}
                        onChangeText={(text) => setName(text)}
                        ></TextInput></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Description'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        defaultValue={addOrEdit ? undefined : description}
                        onChangeText={(text) => setDescription(text)}
                        ></TextInput></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Location'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        defaultValue={addOrEdit ? undefined : location}
                        onChangeText={(text) => setLocation(text)}
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
                        {addOrEdit ? (<Button title="Add" onPress={() => addReminder()}></Button>) : 
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
                dataArray={data}
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