import React, { useState, useContext, useEffect, Component} from 'react';
import { StyleSheet, Image, TextInput, TouchableNativeFeedback, Dimensions, Share, ScrollView, CheckBox} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Overlay, Divider, Button, registerCustomIconType } from 'react-native-elements';
import { Container, Header, Content, Icon, Accordion, Text, View, Picker, Item } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import {MaterialIcons} from '@expo/vector-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import axios from 'axios';
import {JWTContext} from '../contexts/JWTContext.js'
import { useScrollToTop } from '@react-navigation/native';

// https://reactnative.dev/docs/flexbox

const {width: WIDTH} = Dimensions.get('window')
const {height: HEIGHT} = Dimensions.get('window')
const Classes = (props) => {
    const [deleteOverlay, setDeleteOverlay] = useState(false);
    const [addOrEdit, setAddorEdit] = useState(true);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState();
    const [courseCode, setCourseCode] = useState();
    const [location, setLocation] = useState();
    const [professor, setProfessor] = useState();
    const [selectedType, setSelectedType] = useState("Classroom Location");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedItems, setSelectedItems] = useState();
    const [repeatDays, setRepeatDays] = useState([]);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [showStart, setShowStart] = useState(false);
    const [showEnd, setShowEnd] = useState(false);
    const [rand, setRand] = useState(Math.floor(Math.random() * 4));
    // This holds index in state for the edit and delete overlay. 
    const [activeIndex, setActiveIndex] = useState(Number.MIN_SAFE_INTEGER);
    const [triggerRefresh, setTriggerRefresh] = useState(false);

    const ref = React.useRef(null);
    useScrollToTop(ref);
    const jwt = useContext(JWTContext);
    const token = jwt.getToken();

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
        setCourseCode(data[index].courseCode);
        setProfessor(data[index].professor);
        setLocation(data[index].location.location);
        setStartDate(new Date(data[index].start));
        setStartTime(new Date(data[index].start));
        setEndDate(new Date(data[index].end));
        setEndTime(new Date(data[index].end));
        setAddorEdit(false);
        setDeleteOverlay(false);
        toggleOverlay();
    };

    const deleteHelper = (index) => {
        setActiveIndex(index);
        setDeleteOverlay(true); 
        toggleOverlay();
    };

    // https://stackoverflow.com/questions/14872554/sorting-on-a-custom-order
    const daySort = (arr, desiredOrder) => {
        const orderForIndexVals = desiredOrder.slice(0).reverse();
        arr.sort((a, b) => {
          const aIndex = -orderForIndexVals.indexOf(a);
          const bIndex = -orderForIndexVals.indexOf(b);
          return aIndex - bIndex;
        })};
    
    const addClass = async () => {
        const map = repeatDays.map(item => item.name);
        daySort(map, ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
        const response = await axios.post("https://lyfe--app.herokuapp.com/api/courses/", {
            "courseCode": courseCode,
            "professor": professor,
            "location": {
              "type": selectedType,
              "location": location
            },
            "day": map,
            "start": startTime,
            "end": endTime
        }, {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} })
        .catch((error) => console.log(error.response.data.error));
        //setData(response.data);
        setTriggerRefresh(!triggerRefresh);
        toggleOverlay();
    };

    const getClasses = async () => {
        const resp = await axios.get("https://lyfe--app.herokuapp.com/api/users/",
        {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} });
        setData(resp.data.courses);
    }

    const editClass = async () => {
        const resp = await axios.put(`https://lyfe--app.herokuapp.com/api/courses/${data[activeIndex]._id}`, {
            "courseCode": courseCode,
            "professor": professor,
            "location": {
              "type": selectedType,
              "location": location
            },
            "day": repeatDays.map(item => item.name),
            "start": startTime,
            "end": endTime
        }, {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} })
        .catch((error) => console.log(error.response));
        setActiveIndex(Number.MIN_SAFE_INTEGER);
        setTriggerRefresh(!triggerRefresh);
        toggleOverlay();
    };
    
    const deleteClass = async () => {
        const response = await axios.delete(`https://lyfe--app.herokuapp.com/api/courses/${data[activeIndex]._id}`,
        {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} })
        .catch((error) => console.log(error.response));
        setActiveIndex(Number.MIN_SAFE_INTEGER);
        setTriggerRefresh(!triggerRefresh);
        toggleOverlay();       
    };

    const renderHeader = (item) => {
        return(<View style={{
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center" ,
            backgroundColor: "#A9DAD6",
            width: WIDTH - 50 }}>
            <View>
            <Text style={{ fontWeight: "600" }}>
                {item.courseCode}
            </Text>
            </View>
            <View>
            <Text>
                {item.professor}
            </Text>
            </View>
          </View>)
    }

    // Link if location type is link?
    const renderAccordion = (item, index) => {
        return(
        <View style={styles.expandedAccordion}>
        <View style={styles.textSpacing}>
            <Text>Location: {item.location.location}</Text>
        </View>
        <View style={styles.textSpacing}>
            <Text>Class Days: {`${(item.day).join(', ')} 

${formatTimeStart(index)} - ${formatTimeEnd(index)}`}</Text>
        </View>
        <View style={styles.textSpacing}>
            <Text>Started: {formatDateStringStart(index)}</Text>
        </View>
        <View style={styles.textSpacing}>
            <Text>Ending: {formatDateStringEnd(index)}</Text>
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
        </View>)
    }

    // https://stackoverflow.com/questions/58925515/using-react-native-community-datetimepicker-how-can-i-display-a-datetime-picker
    const formatDate = (date, time) => {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`;
    }

    const formatDateStringStart = (index) => {
        const dateCheck = new Date(data[index].start);

        return `${dateCheck.getMonth() + 1}/${dateCheck.getDate()}/${dateCheck.getFullYear()}`;
    }

    const formatDateStringEnd = (index) => {
        const dateCheck = new Date(data[index].end);

        return `${dateCheck.getMonth() + 1}/${dateCheck.getDate()}/${dateCheck.getFullYear()}`;
    }

    const formatTimeStart = (index) => {
        const dateCheck = new Date(data[index].start);

        return `${dateCheck.getHours()}:${dateCheck.getMinutes() < 10 ? '0' + dateCheck.getMinutes() : dateCheck.getMinutes()}`;
    }

    const formatTimeEnd = (index) => {
        const dateCheck = new Date(data[index].end);

        return `${dateCheck.getHours()}:${dateCheck.getMinutes() < 10 ? '0' + dateCheck.getMinutes() : dateCheck.getMinutes()}`;
    }

    const createMsg = () => {
        let msg = `Hello! Here is my class schedule:
        
`;

        for (let i = 0; i < data.length; i++)
        {
            msg += `${i + 1}) ${data[i].courseCode} with ${data[i].professor}
Location: ${data[i].location.location}

${data[i].day.join(', ')} 

${formatTimeStart(i)} - ${formatTimeEnd(i)}
            
Started: ${formatDateStringStart(i)} 

Ending: ${formatDateStringEnd(i)}

`       }

        return msg;
    }

    const onShare = async () => {
        try {
            const msg = createMsg();
            const result = await Share.share({
              message: `${msg}`,
            });
        } catch (error) {
          console.log(error.message);
        }
      };

    useEffect(() => {
       getClasses();
       setRand(Math.floor(Math.random() * 4));
    }, [triggerRefresh]);
    
    return(
        <View style={styles.container}>
            <ScrollView ref={ref} showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow : 1}}>
            <View style={{marginTop: 25, alignItems: 'center', flexDirection:'row', 
            justifyContent: "space-between", width: WIDTH-50}}>
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
                        defaultValue={addOrEdit ? undefined : courseCode}
                        onChangeText={(text) => setCourseCode(text)}
                        ></TextInput></View>
                        <View><TextInput
                        style={styles.inputView}
                        placeholder= 'Professor'
                        placeholderTextColor='black'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        defaultValue={addOrEdit ? undefined : professor}
                        onChangeText={(text) => setProfessor(text)}
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
                        <View style={{width: WIDTH - 50,
                                        height:20,
                                        paddingLeft:12,
                                        paddingBottom: 3,
                                        fontSize: 12}}>
                        <Picker
                            mode="dropdown"
                            placeholder="Type"
                            selectedValue={selectedType}
                            onValueChange={(itemValue, itemIndex) =>
                               { setSelectedType(itemValue);}
                            }>
                                <Picker.Item label="Classroom Location" value="Classroom Location" />
                                <Picker.Item label="Zoom Link" value="Zoom Link" />
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
                                                uniqueKey="name"
                                                selectText="Choose Days"
                                                showDropDowns={false}
                                                onSelectedItemsChange={(selectedItems) => setSelectedItems(selectedItems)}
                                                onSelectedItemObjectsChange={(selectedItems) => {console.log(selectedItems); setRepeatDays(selectedItems);}}
                                                selectedItems={selectedItems}
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
            <View style={{marginVertical: 25, height: (0.01*HEIGHT), width: WIDTH - 50}}>
                <Text>
                {
                    (rand === 0) ? `"If you wish to bake an apple pie from scratch, you must first invent the universe." - Carl Sagan` :
                    (rand === 1) ? `"A ship in harbor is safe, but that is not what ships are built for." - John A. Shedd` :
                    (rand === 2) ? `"With great power comes great responsibility." - Stan Lee` :
                    `"The early bird catches the worm but the second mouse eats the cheese." - Unknown Redditor`
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
                onPress={onShare} title="Share">
                    <Text style={styles.signUp}>Share Classes</Text>
            </Button>
            </ScrollView>
        </View>
    );
}

export default Classes;
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
        marginTop: 50
    },
    expandedAccordion: {
        width: WIDTH - 50
    },
    textSpacing:{
        marginVertical: 10
    },
});