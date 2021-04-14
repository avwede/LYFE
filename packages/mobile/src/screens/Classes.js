import React, { useState, useContext, useEffect, Component} from 'react';
import { StyleSheet, Image, TextInput, TouchableNativeFeedback, Dimensions, CheckBox} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Overlay, Divider, Button, registerCustomIconType } from 'react-native-elements';
import { Container, Header, Content, Icon, Accordion, Text, View, Picker } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import {MaterialIcons} from '@expo/vector-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

// https://reactnative.dev/docs/flexbox

const {width: WIDTH} = Dimensions.get('window')
const {height: HEIGHT} = Dimensions.get('window')
const Classes = (props) => {
    // Fetch tasks after each modal submission. Make sure it's async.
    // Call setData on response to store in state.
    const [deleteOverlay, setDeleteOverlay] = useState(false);
    const [addOrEdit, setAddorEdit] = useState(true);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [repeatDays, setRepeatDays] = useState([]);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [showStart, setShowStart] = useState(false);
    const [showEnd, setShowEnd] = useState(false);
    // This holds index in state for the edit and delete overlay. 
    const [activeIndex, setActiveIndex] = useState(Number.MIN_SAFE_INTEGER);
    const [selectedType, setSelectedType] = useState();

    // Notification scheduling?
    // Get start date, end date, and weekdays from a picker/selector(checkbox, text, flatlist). 
    // Store selected values as integers in set. After submitted, find and store smallest present value
    // then spread to array and rebase so lowest number is 0.
    // Use stored start date and add each (nonzero) integer to it, then schedule a notification 
    // repeating until (end date + integer).
    // Need to store a notification id in the database in order to unsubscribe

    // https://stackoverflow.com/questions/58925515/using-react-native-community-datetimepicker-how-can-i-display-a-datetime-picker
    const onChangeStartDate = (event, selectedDate) => {
        setShowStart(Platform.OS === 'ios');
        if (mode == 'date') {
            const currentDate = selectedDate || startDate;
            setStartDate(currentDate);
            setMode('time');
            setShowStart(Platform.OS !== 'ios'); 
        } else {
            const selectedTime = selectedDate || new Date();
            setStartTime(selectedTime);
            setShowStart(Platform.OS === 'ios'); 
            setMode('date'); 
        }
    };

    const onChangeEndDate = (event, selectedDate) => {
        setShowEnd(Platform.OS === 'ios');
        if (mode == 'date') {
            const currentDate = selectedDate || endDate;
            setEndDate(currentDate);
            setMode('time');
            setShowEnd(Platform.OS !== 'ios'); 
        } else {
            const selectedTime = selectedDate || new Date();
            setEndTime(selectedTime);
            setShowEnd(Platform.OS === 'ios'); 
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
    const addClass = () => {
        return;
    }

    const editClass = () => {

        setActiveIndex(Number.MIN_SAFE_INTEGER);
        toggleOverlay();
        return;
    }
    
    const deleteClass = () => {

        setActiveIndex(Number.MIN_SAFE_INTEGER);
        toggleOverlay();       
        return;
    }

    const renderHeader = () => {
        return(<View style={{
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center" ,
            backgroundColor: "#A9DAD6" }}>
            <View>
            <Text style={{ fontWeight: "600" }}>
                COP 4331
            </Text>
            </View>
            <View>
            <Text>
                Dr. Richard Leinecker
            </Text>
            </View>
          </View>)
    }

    // Take in individual items once API set up
    // Accordion component should handle .map()
    // Try to set up so the item's position in array (index) is passed
    // to editHelper()
    // Link if location.type="Link", else text
    const renderAccordion = () => {
        return(
        <View style={styles.expandedAccordion}>
        <View style={styles.textSpacing}>
            <Text>(Zoom Link Here)</Text>
        </View>
        <View style={styles.textSpacing}>
            <Text>Class Days: Monday, Wednesday, Friday (times from start/end date)</Text>
        </View>
        <View style={styles.textSpacing}>
            <Text>Started: 01/10/2021</Text>
        </View>
        <View style={styles.textSpacing}>
            <Text>Ending: 04/28/2021</Text>
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
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`;
    };

    // For testing purposes
    const dataArray = [
        {title: "1"}
    ];

    /*useEffect(() => {
       getClasses();
    }, [data]); */
    
    return(
        <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style={styles.container}>
            <View style={{alignItems:'center', marginTop: 150, flexDirection:'row', 
            justifyContent: "space-between", width:WIDTH-100}}>
                <Text>
                    Classes
                </Text>
                <Button title="Add Class" onPress = {() => {setDeleteOverlay(false); setAddorEdit(true); toggleOverlay();}} />
                    {(!deleteOverlay) ?
                        (<Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                        <View><Text>New Class</Text></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Course Code'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        ></TextInput></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Professor'
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
                        <View style={{width: WIDTH - 100,
                                        height:20,
                                        paddingLeft:12,
                                        paddingBottom: 3,
                                        fontSize: 12}}>
                        <Picker
                            mode="dropdown"
                            placeholder="Type"
                            selectedValue={selectedType}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedType(itemValue)
                            }>
                                <Picker.Item label="Address" value="Address" />
                                <Picker.Item label="Link" value="Link" />
                        </Picker>
                        </View>
                        <View style={styles.inputView, {paddingLeft: 10}}>
                         <SectionedMultiSelect items={[  {name: 'Sunday',
                                                        id: 1,
                                                        },{name: 'Monday',
                                                        id: 2,
                                                        },{name: 'Tuesday',
                                                        id: 3,
                                                        },{name: 'Wednesday',
                                                        id: 4,
                                                        },{name: 'Thursday',
                                                        id: 5,
                                                        },{name: 'Friday',
                                                        id: 6,
                                                        },{name: 'Saturday',
                                                        id: 7,
                                                        },
                                                    ]}
                                                IconRenderer={MaterialIcons}
                                                uniqueKey="id"
                                                selectText="Choose Days"
                                                showDropDowns={false}
                                                onSelectedItemsChange={(selectedItems) => setRepeatDays(selectedItems)}
                                                selectedItems={repeatDays}
                                                showChips={false} />
                                                </View>
                        <View style={styles.inputView}>
                        <Text>Select Start Date/Time</Text>
                        <TouchableNativeFeedback 
                        title='Select Start Date/Time'
                        onPress={() => {setShowStart(true); setMode('date');}}>
                            <Text>{formatDate(startDate, startTime)}</Text>
                        </TouchableNativeFeedback>
                        {showStart && (
                            <DateTimePicker
                                value={startDate}
                                display='default'
                                mode={mode}
                                onChange={onChangeStartDate}
                            />
                        )}
                        </View>
                        <View style={styles.inputView}>
                        <Text>Select End Date/Time</Text>
                        <TouchableNativeFeedback 
                        title='Select End Date/Time'
                        onPress={() => {setShowEnd(true); setMode('date');}}>
                            <Text>{formatDate(endDate, endTime)}</Text>
                        </TouchableNativeFeedback>
                        {showEnd && (
                            <DateTimePicker
                                value={endDate}
                                display='default'
                                mode={mode}
                                onChange={onChangeEndDate}
                            />
                        )}
                        </View>
                        {addOrEdit ? (<Button title="Add" onPress={() => addClass()}></Button>) : 
                        (<Button title="Edit" onPress={() => editClass()}></Button>)}
                        </Overlay>) :
                        (<Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                        <Text> Are you sure you want to delete this class? </Text>
                        <View style= {{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                            <TouchableNativeFeedback style={styles.loginBtn}
                            onPress = {() => {setActiveIndex(Number.MIN_SAFE_INTEGER); toggleOverlay();}}>
                                <Text>
                                Cancel
                                </Text>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback style={styles.loginBtn}
                            onPress = {() => deleteClass()}>
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

export default Classes;
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