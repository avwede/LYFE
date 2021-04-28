import React, { useState, useContext, useEffect, Component} from 'react';
import { StyleSheet, Image, TextInput, TouchableNativeFeedback, Dimensions, Share, ScrollView, CheckBox} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Overlay, Divider, Button, registerCustomIconType } from 'react-native-elements';
import { Container, Header, Content, Icon, Accordion, Text, View, Item } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import {JWTContext} from '../contexts/JWTContext.js'
import { useScrollToTop } from '@react-navigation/native';

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
    const [rand, setRand] = useState(Math.floor(Math.random() * 4));

    const ref = React.useRef(null);
    useScrollToTop(ref);
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
            backgroundColor: "#A9DAD6",
            width: WIDTH - 50 }}>
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
            <Text>Location: {item.location.location}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: "space-around", paddingBottom: 10}}>
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

    const createMsg = () => {
        let msg = `Hello! Here are my LYFE Reminders:
        
`;
        for (let i = 0; i < data.length; i++)
        {
            msg += `${i + 1}) ${data[i].name}
${formatDateString(i)}
            
${data[i].description}
            
Location: ${data[i].location.location}

`
        }

        return msg;
    }

    const onShare = async () => {
        try {
          const msg = createMsg();
          const result = await Share.share({
            message: msg,
          });
        } catch (error) {
          console.log(error.message);
        }
      };

    useEffect(() => {
       getReminders();
       setRand(Math.floor(Math.random() * 4));
    }, [triggerRefresh]);
    
    return(
        <View style={styles.container}>
            <ScrollView ref={ref} contentContainerStyle={{flexGrow : 1}}
            showsVerticalScrollIndicator={false}>
            <View style={{marginTop: 25, alignItems:'center', flexDirection:'row', justifyContent: "space-between", width:WIDTH-50}}>
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
            <View style={{marginVertical: 25, height: (0.01*HEIGHT), width: WIDTH - 50}}>
                <Text>
                {
                    (rand === 0) ? `"Write a wise saying and your name will live forever. " - Anonymous` :
                    (rand === 1) ? `"People say nothing is impossible, but I do nothing every day." - A.A. Milne` :
                    (rand === 2) ? `"A witty saying proves nothing." - Voltaire` :
                    `"JUST DO IT" - Shia Labeouf`
                }
                </Text>
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
            <Button style={styles.loginBtn}
                onPress={() => onShare()} title="Share">
                    <Text style={styles.signUp} >Share Reminders</Text>
            </Button>
            </ScrollView>
        </View>
    );
}

export default Reminders;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor:'#eae9eb'
    },
    inputContainer:{
        marginTop:10
    },
    inputView:{
        width: WIDTH - 50,
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
        //color:'white',
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
        marginTop: 30
    },
    expandedAccordion: {
        width: WIDTH - 50
    },
    textSpacing:{
        marginVertical: 10
    },
});