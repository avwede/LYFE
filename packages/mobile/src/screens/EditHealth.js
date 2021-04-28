import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, ScrollView, KeyboardAvoidingView, TouchableNativeFeedback} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { List } from 'react-native-paper';
import { ListItem, Divider, Icon, Overlay, Button, Input} from 'react-native-elements';
import {Picker} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import {JWTContext} from '../contexts/JWTContext.js'

const EditHealth = ({navigation}) => {
    const jwt = useContext(JWTContext);
    
    const [create, setCreate] = useState(false); // set to true if getHealthProfile returns an empty array.
    const [index, setIndex] = useState(0);

    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [type, setType] = useState();
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [deleteOL, setDeleteOL] = useState(false);
    const [deleteHealthConditionOL, setDeleteHealthConditionOL] = useState(false);
    const [deleteMedicationOL, setDeleteMedicationOL] = useState(false);
    const [deleteContactOL, setDeleteContactOL] = useState(false);

    const [addAllergyOL, setAddAllergyOL] = useState(false);
    const [addHealthConditionsOL, setAddHealthConditionsOL] = useState(false);
    const [addContactOL, setAddContactOL] = useState(false);
    const [addMedicationOL, setAddMedicationOL] = useState(false);

    const [viewOrEditAllergyOL, setViewOrEditAllergyOL] = useState(false);
    const [editAllergy, setEditAllergy] = useState(false);

    const [viewOrEditHealthConditionOL, setViewOrEditHealthConditionOL] = useState(false);
    const [editHealthCondition, setEditHealthCondition] = useState(false);

    const [viewOrEditMedicationOL, setViewOrEditMedicationOL] = useState(false);
    const [editMedication, setEditMedication] = useState(false);

    const [viewOrEditContact, setViewOrEditContact] = useState(false);
    const [editContact, setEditContact] = useState(false);

    const [dateOfBirth, setDOB] = useState(""); // Gen health info
    const [height, setHeight] = useState(0); // gen health info
    const [weight, setWeight] = useState(0); // gen health info
    const [gender, setGender] = useState(""); // gen health info
    const [bloodType, setBloodType] = useState(""); // gen health info

    const [allergyText, setAllergyText] = useState("");
    const [allergyList, setAllergyList] = useState([]); // wrap this in a function and call .concat to update array
    const [healthConditionsText, setHealthConditionsText] = useState("");
    const [healthConditionsList, setHealthConditionsList] = useState([]);
    const [initialMedicationState, setInitialMedicationState] = useState(
        {
            name: "",
            dosage: "",
            frequency: "",
            // reminder: {
            //     name: "",
            //     description: "",
            //     location: {
            //         type: "",
            //         location: "",
            //     },
            //     startDate: "",
            // }
        });
    const [medication, setMedication] = useState(initialMedicationState);
    const [medicationList, setMedicationList] = useState([]);

    const [initialState, setInitialState] = useState(
        {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            relation: "",
        }
    );
    const [emergencyContact, setEmergencyContact] = useState(initialState);
    
    const [emergencyContactsList, setEmergencyContactsList] = useState ([]);
    const [additionalInformation, setAdditionalInformation] = useState("");
    
    const getHealthProfile = async() => {
        const resp = await axios.get("https://lyfe--app.herokuapp.com/api/health", 
        {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} });
        if(resp.data.length)
        {
            console.log("it's empty");
            setCreate(true);
        }
        else
        {
            setDate(new Date(resp.data.dateOfBirth));
            setDOB(resp.data.dateOfBirth);
            setHeight(resp.data.height);
            setWeight(resp.data.weight);
            setGender(resp.data.gender);
            setBloodType(resp.data.bloodType);
            setAllergyList(resp.data.allergies);
            setHealthConditionsList(resp.data.healthConditions);
            setMedicationList(resp.data.medications);
            setEmergencyContactsList(resp.data.emergencyContacts);
            setAdditionalInformation(resp.data.additionalInformation);
        }
    }

    const createHealthProfile = async () => {
        const response = await axios.post("https://lyfe--app.herokuapp.com/api/health",
        {
            "dateOfBirth": dateOfBirth,
            "height": height,
            "weight": weight,
            "gender": gender,
            "bloodType": bloodType,
            "allergies": allergyList,
            "medications": medicationList,
            "emergencyContacts": emergencyContactsList,
            "additionalInformation": additionalInformation
        }, {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} })
        .catch((error) =>(error.response.data.error));
    }

    const updateHealthProfile = async () => {
        const response = await axios.put("https://lyfe--app.herokuapp.com/api/health",
        {
            "dateOfBirth": dateOfBirth,
            "height": height,
            "weight": weight,
            "gender": gender,
            "bloodType": bloodType,
            "allergies": allergyList,
            "healthConditions": healthConditionsList,
            "medications": medicationList,
            "emergencyContacts": emergencyContactsList,
            "additionalInformation": additionalInformation
        }, {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} })
        .catch((error) =>(error.response.data.error));
        navigation.navigate('Health Profile');
    }

    const updateAllergyText = (text) => {
        setAllergyText(text);
        console.log(text);
    }

    const updateAllergyList = () => {
        setAllergyList(allergyList => [...allergyList, allergyText]);
        console.log(allergyList);
    }

    const updateHealthConditionsText = (text) => {
        setHealthConditionsText(text);
        console.log(text);
    }

    const updateHealthConditionsList = () => {
        setHealthConditionsList(healthConditionsList => [...healthConditionsList, healthConditionsText]);
        console.log(allergyList);
    }

    const updateEmergencyContactsList = () => {
        setEmergencyContactsList(emergencyContactsList => [...emergencyContactsList, emergencyContact]);
        console.log(emergencyContactsList);
    }

    const updateMedicationList = () => {
        setMedicationList(medicationList => [...medicationList, medication]);
        console.log(medicationList);
    }

    const editAllergyList = () => {
        let newAllergyList = [...allergyList];
        newAllergyList[index] = allergyText;
        setAllergyList(newAllergyList);
    }

    const editHealthConditionsList = () => {
        let newHealthConditionsList = [...healthConditionsList];
        newHealthConditionsList[index] = healthConditionsText;
        setHealthConditionsList(newHealthConditionsList);
    }

    const editEmergencyContactsList = () => {
        let newEmergencyContactsList = [...emergencyContactsList];
        newEmergencyContactsList[index] = emergencyContact;
        setEmergencyContactsList(newEmergencyContactsList);
    }
    
    const editMedicationList = () => {
        let newMedicationList = [...medicationList];
        newMedicationList[index] = medication;
        setMedicationList(newMedicationList);
    }

    const deleteAllergy = () => {
        let temp = [...allergyList];
        temp.splice(index, 1);
        setAllergyList(temp);
    }

    const deleteHealthCondition = () => {
        let temp = [...healthConditionsList];
        temp.splice(index, 1);
        setHealthConditionsList(temp);
    }

    const deleteContact = () => {
        let temp = [...emergencyContactsList];
        temp.splice(index,1);
        setEmergencyContactsList(temp);
    }

    const deleteMedication = () => {
        let temp = [...medicationList];
        temp.splice(index, 1);
        setMedicationList(temp);
    }

    const setContactToView = (i) => {
        setEmergencyContact(emergencyContactsList[i]);
    }
     
    const setMedicationToView = (i) => {
        setMedication(medicationList[i]);
    }

    const onChangeDate = (event, selectedDate) => {
        
        if (mode == 'date' && show == true) {
            const currentDate = selectedDate || date;
            setShow(false);
            setDate(currentDate);
            setDOB(currentDate);
        }
        //setShow(false);
    };

    const formatDate = (date, time) => {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    const showDatepicker = () => {
        showMode('date');
    };
    useEffect(() => {
        getHealthProfile();
    }, []);

    return(
        <View style={styles.container}>
            <SafeAreaProvider>
                 <ScrollView style={{flex:1, margin:12}}>
                    <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style= {{flex:5, backgroundColor:'white', borderRadius:15}}>
                        <List.Accordion
                        title="General Health Info">
                            <ListItem bottomDivider>
                                <ListItem.Content style={{flex:1, flexDirection:'row'}}>
                                    <View style={{flex:1}}>
                                        <ListItem.Title>Date Of Birth:</ListItem.Title>
                                    </View>
                                    <View style={{flex:1, flexDirection:'row-reverse'}}>
                                        {/* <TextInput
                                        style={styles.inputView}
                                        defaultValue={dateOfBirth}
                                        onChangeText={setDOB}>
                                        </TextInput> */}
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
                                </ListItem.Content>
                            </ListItem>
                            <ListItem bottomDivider>
                                <ListItem.Content style={{flex:1, flexDirection:'row'}}>
                                    <View style={{flex:1}}>
                                        <ListItem.Title>Height (inches):</ListItem.Title>
                                    </View>
                                    <View style={{flex:1, flexDirection:'row-reverse'}}>
                                        <TextInput
                                        style={styles.inputView}
                                        defaultValue={height.toString()}
                                        onChangeText={setHeight}>
                                        </TextInput>
                                    </View>
                                </ListItem.Content>
                            </ListItem>
                            <ListItem bottomDivider>
                                <ListItem.Content style={{flex:1, flexDirection:'row'}}>
                                    <View style={{flex:1}}>
                                        <ListItem.Title>Weight (lbs):</ListItem.Title>
                                    </View>
                                    <View style={{flex:1, flexDirection:'row-reverse'}}>
                                        <TextInput
                                        style={styles.inputView}
                                        defaultValue={weight.toString()}
                                        onChangeText={setWeight}>
                                        </TextInput>
                                    </View>
                                </ListItem.Content>
                            </ListItem>
                            <ListItem bottomDivider
                            style={{}}>
                                <ListItem.Content style={{flex:1, flexDirection:'row'}}>
                                    <View style={{flex:1}}>
                                        <ListItem.Title>Gender:</ListItem.Title>
                                    </View>
                                    <View style={{flex:1, flexDirection:'column-reverse'}}>
                                        <Picker mode="dropdown"
                                        placeholder="Gender"
                                        selectedValue={gender}
                                        onValueChange={item => setGender(item)}>
                                            <Picker.Item label="Male" value="Male"/>
                                            <Picker.Item label="Female" value="Female" />
                                            <Picker.Item label="Prefer not to say" value="Prefer not to say" />
                                        </Picker>
                                    </View>
                                </ListItem.Content>
                            </ListItem>
                            <ListItem bottomDivider>
                                <ListItem.Content style={{flex:1, flexDirection:'row'}}>
                                    <View style={{flex:1}}>
                                        <ListItem.Title>Blood Type:</ListItem.Title>
                                    </View>
                                    <View style={{flex:1, flexDirection:'column-reverse'}}>
                                    <Picker mode="dropdown"
                                        placeholder="Gender"
                                        selectedValue={bloodType}
                                        onValueChange={item => setBloodType(item)}>
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
                                </ListItem.Content>
                            </ListItem>
                        </List.Accordion>
                    </LinearGradient>

                    <Divider style={{backgroundColor:'#c8c8c8', paddingBottom:15}}></Divider>

                    <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style= {{flex:5, backgroundColor:'white', borderRadius:15}}>
                        <List.Accordion
                        title="Allergies">
                        {
                            allergyList.map((l,i) => (
                                <ListItem key={i}
                                bottomDivider
                                onPress={() => {setIndex(i); setViewOrEditAllergyOL(true);}}
                                onLongPress={() => {setIndex(i); setDeleteOL(true);}}>
                                <ListItem.Content>
                                    <ListItem.Title>{l}</ListItem.Title>
                                </ListItem.Content>
                                <ListItem.Chevron/>
                            </ListItem>
                            ))
                        }
                        </List.Accordion>
                        <View style={styles.bottomView}>
                            <Icon
                            raised
                            name='plus'
                            type='font-awesome'
                            color='#f50'
                            size={17}
                            onPress={() => setAddAllergyOL(true)}>
                            </Icon>
                        </View>
                    </LinearGradient>

                        <Overlay
                        isVisible={addAllergyOL}
                        onBackdropPress={() => setAddAllergyOL(false)}
                        fullScreen={false}>
                            <View style={{alignItems:'center', paddingBottom:10}}>
                                <Text style={{fontSize: 17,fontWeight:'bold'}}>Add an Allergy</Text>
                            </View>
                            <View>
                                <TextInput
                                style={styles.inputView}
                                placeholder= 'Allergy Name'
                                placeholderTextColor='black'
                                underlineColorAndroid='transparent'
                                returnKeyType='next'
                                blurOnSubmit={false}
                                onChangeText={updateAllergyText}>
                                </TextInput>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flexDirection:'row'}}>
                                    <Button
                                    title="Cancel"
                                    type='clear'
                                    onPress={() => {setAddAllergyOL(false); setAllergyText("");}}>
                                    </Button>
                                </View>
                                <View style={{flexDirection:'row', marginLeft:50}}>
                                    <Button
                                    title="Submit"
                                    type='clear'
                                    onPress={() => {setAddAllergyOL(false); updateAllergyList(); setAllergyText("");}}>
                                    </Button>
                                </View>
                            </View>
                        </Overlay>

                        <Overlay
                        isVisible={viewOrEditAllergyOL}
                        onBackdropPress={() => {setViewOrEditAllergyOL(false); setEditAllergy(false);}}
                        fullScreen={false}>
                            <View style={{alignItems:'center', paddingBottom:10}}>
                                <Text style={{fontSize: 17,fontWeight:'bold'}}>Allergy Name</Text>
                            </View>
                            <View>
                                <TextInput
                                style={styles.inputView}
                                placeholder= 'Allergy Name'
                                placeholderTextColor='black'
                                underlineColorAndroid='transparent'
                                returnKeyType='next'
                                blurOnSubmit={false}
                                defaultValue={allergyList[index]}
                                editable={editAllergy}
                                onChangeText={updateAllergyText}>
                                </TextInput>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flexDirection:'row'}}>
                                    <Button
                                    title="Cancel"
                                    type='clear'
                                    onPress={() => {setViewOrEditAllergyOL(false); setEditAllergy(false);}}>
                                    </Button>
                                </View>
                                <View style={{flexDirection:'row', marginLeft:50}}>
                                {!editAllergy ?
                                    <Button
                                    title="Edit"
                                    type='clear'
                                    onPress={() => {setEditAllergy(true)}}>
                                    </Button>
                                :
                                    <Button
                                    title="Save"
                                    type='clear'
                                    onPress={() => {setViewOrEditAllergyOL(false); setEditAllergy(false); editAllergyList();}}>
                                    </Button>}
                                </View>
                            </View>
                        </Overlay>

                    <Divider style={{backgroundColor:'#c8c8c8', paddingBottom:15}}></Divider>

                    <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style= {{flex:5, backgroundColor:'white', borderRadius:15}}>
                        <List.Accordion
                        title="Health Conditions"
                        style={{}}>
                            {
                            healthConditionsList.map((l,i) => (
                                <ListItem key={i} 
                                bottomDivider
                                onPress={() => {setIndex(i); setViewOrEditHealthConditionOL(true);}}
                                onLongPress={() => {setIndex(i); setDeleteHealthConditionOL(true)}}>
                                <ListItem.Content>
                                    <ListItem.Title>{l}</ListItem.Title>
                                </ListItem.Content>
                                <ListItem.Chevron/>
                            </ListItem>
                            ))
                        }
                        </List.Accordion>
                        <View style={styles.bottomView}>
                            <Icon
                                raised
                                name='plus'
                                type='font-awesome'
                                color='#f50'
                                size={17}
                                onPress={() => setAddHealthConditionsOL(true)}>
                            </Icon>
                        </View>
                    </LinearGradient>

                    <Overlay
                        isVisible={deleteHealthConditionOL}
                        onBackdropPress={() => setDeleteHealthConditionOL(false)}
                        fullScreen={false}>
                            <View style={{alignItems:'center', paddingBottom:10}}>
                                <Text style={{fontSize: 17,fontWeight:'bold'}}>Are you sure you want</Text>
                                <Text style={{fontSize:17, fontWeight:'bold'}}>to delete this?</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flexDirection:'row'}}>
                                    <Button
                                    title="Cancel"
                                    type='clear'
                                    onPress={() => {setDeleteHealthConditionOL(false);}}>
                                    </Button>
                                </View>
                                <View style={{flexDirection:'row', marginLeft:50}}>
                                    <Button
                                    title="Yes"
                                    type='clear'
                                    onPress={() => {setDeleteHealthConditionOL(false); deleteHealthCondition();}}>
                                    </Button>
                                </View>
                            </View>
                        </Overlay>

                    <Overlay
                        isVisible={addHealthConditionsOL}
                        onBackdropPress={() => setAddHealthConditionsOL(false)}
                        fullScreen={false}>
                            <View style={{alignItems:'center', paddingBottom:10}}>
                                <Text style={{fontSize: 17,fontWeight:'bold'}}>Add a Health Condition</Text>
                            </View>
                            <View>
                                <TextInput
                                style={styles.inputView}
                                placeholder= 'Health Condition Name'
                                placeholderTextColor='black'
                                underlineColorAndroid='transparent'
                                returnKeyType='next'
                                blurOnSubmit={false}
                                onChangeText={updateHealthConditionsText}></TextInput>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flexDirection:'row'}}>
                                    <Button
                                    title="Cancel"
                                    type='clear'
                                    onPress={() => {setAddHealthConditionsOL(false); setHealthConditionsText("");}}>
                                    </Button>
                                </View>
                                <View style={{flexDirection:'row', marginLeft:50}}>
                                    <Button
                                    title="Submit"
                                    type='clear'
                                    onPress={() => {setAddHealthConditionsOL(false); updateHealthConditionsList(); setHealthConditionsText("");}}>
                                    </Button>
                                </View>
                            </View>
                        </Overlay>

                        <Overlay
                        isVisible={viewOrEditHealthConditionOL}
                        onBackdropPress={() => {setViewOrEditHealthConditionOL(false); setEditHealthCondition(false);}}
                        fullScreen={false}>
                            <View style={{alignItems:'center', paddingBottom:10}}>
                                <Text style={{fontSize: 17,fontWeight:'bold'}}>Health Condition</Text>
                            </View>
                            <View>
                                <TextInput
                                style={styles.inputView}
                                placeholderTextColor='black'
                                underlineColorAndroid='transparent'
                                returnKeyType='next'
                                blurOnSubmit={false}
                                defaultValue={healthConditionsList[index]}
                                editable={editHealthCondition}
                                onChangeText={updateHealthConditionsText}>
                                </TextInput>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flexDirection:'row'}}>
                                    <Button
                                    title="Cancel"
                                    type='clear'
                                    onPress={() => {setViewOrEditHealthConditionOL(false); setEditHealthCondition(false);}}>
                                    </Button>
                                </View>
                                <View style={{flexDirection:'row', marginLeft:50}}>
                                {!editHealthCondition ?
                                    <Button
                                    title="Edit"
                                    type='clear'
                                    onPress={() => {setEditHealthCondition(true)}}>
                                    </Button>
                                :
                                    <Button
                                    title="Save"
                                    type='clear'
                                    onPress={() => {setViewOrEditHealthConditionOL(false); setEditHealthCondition(false); editHealthConditionsList();}}>
                                    </Button>}
                                </View>
                            </View>
                        </Overlay>

                    <Divider style={{backgroundColor:'#c8c8c8', paddingBottom:15}}></Divider>

                    <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style= {{flex:5, backgroundColor:'white', borderRadius:15}}>
                        <List.Accordion
                        title="Medications">
                            {
                            medicationList.map((l,i) => (
                                <ListItem key={i} 
                                bottomDivider
                                onPress={() => {setIndex(i); setMedicationToView(i); setViewOrEditMedicationOL(true);}}
                                onLongPress={() => {setIndex(i); setDeleteMedicationOL(true);}}>
                                <ListItem.Content>
                                    <ListItem.Title>{l.name}</ListItem.Title>
                                    <ListItem.Subtitle>{l.dosage} {l.frequency}</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron/>
                            </ListItem>
                            ))
                        }
                        </List.Accordion>
                        <View style={styles.bottomView}>
                            <Icon
                                raised
                                name='plus'
                                type='font-awesome'
                                color='#f50'
                                size={17}
                                onPress={() => setAddMedicationOL(true)}>
                            </Icon>
                        </View>
                    </LinearGradient>

                    <Overlay
                        isVisible={deleteMedicationOL}
                        onBackdropPress={() => setDeleteMedicationOL(false)}
                        fullScreen={false}>
                            <View style={{alignItems:'center', paddingBottom:10}}>
                                <Text style={{fontSize: 17,fontWeight:'bold'}}>Are you sure you want</Text>
                                <Text style={{fontSize:17, fontWeight:'bold'}}>to delete this?</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flexDirection:'row'}}>
                                    <Button
                                    title="Cancel"
                                    type='clear'
                                    onPress={() => {setDeleteMedicationOL(false);}}>
                                    </Button>
                                </View>
                                <View style={{flexDirection:'row', marginLeft:50}}>
                                    <Button
                                    title="Yes"
                                    type='clear'
                                    onPress={() => {setDeleteMedicationOL(false); deleteMedication();}}>
                                    </Button>
                                </View>
                            </View>
                    </Overlay>

                    <Overlay
                        isVisible={addMedicationOL}
                        onBackdropPress={() => {setAddMedicationOL(false); setMedication(initialMedicationState);}}
                        fullScreen={false}
                        overlayStyle={{ marginTop:100, marginBottom:100}}>
                            <View style={{alignItems:'center', paddingBottom:10}}>
                                <Text style={{fontSize: 17,fontWeight:'bold'}}>Add a Medication</Text>
                            </View>
                            <ScrollView style = {{}}>
                                <Text>Name:</Text>
                                <TextInput
                                style={styles.inputView}
                                onChangeText={(text) => {setMedication({...medication, name: text});}}>
                                </TextInput>
                                <Text>Dosage:</Text>
                                <TextInput
                                style={styles.inputView}
                                onChangeText={(text) => {setMedication({...medication, dosage: text});}}>
                                </TextInput>
                                <Text>Frequency:</Text>
                                <TextInput
                                style={styles.inputView}
                                onChangeText={(text) => {setMedication({...medication, frequency: text});}}>
                                </TextInput>
                                {/* <Text style={{fontSize:14, fontWeight:'bold', paddingLeft:60}}>Reminder</Text>
                                <Text>Name:</Text>
                                <TextInput
                                style={styles.inputView}
                                onChangeText={(text) => {setMedication({...medication, reminder:{name: text}});}}>
                                </TextInput>
                                <Text>Description:</Text>
                                <TextInput
                                style={styles.inputView}
                                multiline={true}
                                onChangeText={(text) => {setMedication({...medication, reminder:{description: text}});}}>
                                </TextInput>
                                <Text>Start Date:</Text>
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
                                )} */}
                            </ScrollView>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flexDirection:'row'}}>
                                    <Button
                                    title="Cancel"
                                    type='clear'
                                    onPress={() => {setAddMedicationOL(false); setMedication(initialMedicationState);}}>
                                    </Button>
                                </View>
                                <View style={{flexDirection:'row', marginLeft:50}}>
                                    <Button
                                    title="Submit"
                                    type='clear'
                                    onPress={() => {setAddMedicationOL(false);
                                    updateMedicationList();
                                    setMedication(initialMedicationState);}}>
                                    </Button>
                                </View>
                        </View>
                    </Overlay>

                    <Overlay
                    isVisible={viewOrEditMedicationOL}
                    onBackdropPress={() => {setViewOrEditMedicationOL(false); setMedication(initialMedicationState);}}
                    fullScreen={false}
                    overlayStyle={{marginTop:100, marginBottom:100}}>
                        <View style={{alignItems:'center', paddingBottom:10}}>
                            <Text style={{fontSize: 17,fontWeight:'bold'}}>Medication</Text>
                        </View>
                        <ScrollView style = {{}}>
                        <Text>Name:</Text>
                            <TextInput
                            style={styles.inputView}
                            editable={editMedication}
                            defaultValue={medication.name}
                            onChangeText={(text) => {setMedication({...medication, name: text});}}>
                            </TextInput>
                            <Text>Dosage:</Text>
                            <TextInput
                            style={styles.inputView}
                            editable={editMedication}
                            defaultValue={medication.dosage}
                            onChangeText={(text) => {setMedication({...medication, dosage: text});}}>
                            </TextInput>
                            <Text>Frequency:</Text>
                            <TextInput
                            style={styles.inputView}
                            editable={editMedication}
                            defaultValue={medication.frequency}
                            onChangeText={(text) => {setMedication({...medication, frequency: text});}}>
                            </TextInput>
                            {/* <Text style={{fontSize:14, fontWeight:'bold', paddingLeft:60}}>Reminder</Text>
                            <Text>Name:</Text>
                            <TextInput
                            style={styles.inputView}
                            editable={editMedication}
                            defaultValue={medication.reminder.name}
                            onChangeText={(text) => {setMedication({...medication, reminder:{name: text}});}}>
                            </TextInput>
                            <Text>Description:</Text>
                            <TextInput
                            style={styles.inputView}
                            multiline={true}
                            editable={editMedication}
                            defaultValue={medication.reminder.description}
                            onChangeText={(text) => {setMedication({...medication, reminder:{description: text}});}}>
                            </TextInput>
                            <Text>Start Date:</Text>
                                <TouchableNativeFeedback 
                                title='Show Date Picker'
                                onPress={() => showDatepicker()}>
                                    <Text>{formatDate(date, time)}</Text>
                                </TouchableNativeFeedback>
                                {show && (
                                    <DateTimePicker
                                        value={medication.reminder.startDate}
                                        display='default'
                                        mode={mode}
                                        onChange={onChangeDate}
                                    />
                                )} */}
                        </ScrollView>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'row'}}>
                                <Button
                                title="Cancel"
                                type='clear'
                                onPress={() => {setViewOrEditMedicationOL(false); setEditMedication(false); setMedication(initialMedicationState);}}>
                                </Button>
                            </View>
                            
                            <View style={{flexDirection:'row', marginLeft:50}}>
                            {!editContact ?
                                <Button
                                title="Edit"
                                type='clear'
                                onPress={() => {setEditMedication(true)}}>
                                </Button>
                            :
                                <Button
                                title="Save"
                                type='clear'
                                onPress={() => {setViewOrEditMedicationOL(false); setEditMedication(false); editMedicationList(); setMedication(initialMedicationState);}}>
                                </Button>}
                            </View>
                        </View>
                    </Overlay>    

                    <Divider style={{backgroundColor:'#c8c8c8', paddingBottom:15}}></Divider>

                    <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style= {{flex:5, backgroundColor:'white', borderRadius:15}}>
                        <List.Accordion
                        title="Emergency Contacts">
                            {
                            emergencyContactsList.map((l,i) => (
                                <ListItem key={i} 
                                bottomDivider
                                onPress={() => {setIndex(i); setContactToView(i); setViewOrEditContact(true);}}
                                onLongPress={() => {setIndex(i); setDeleteContactOL(true);}}>
                                <ListItem.Content>
                                    <ListItem.Title>{l.firstName} {l.lastName}</ListItem.Title>
                                </ListItem.Content>
                                <ListItem.Chevron/>
                            </ListItem>
                            ))
                        }
                        </List.Accordion>
                        <View style={styles.bottomView}>
                            <Icon
                            raised
                            name='plus'
                            type='font-awesome'
                            color='#f50'
                            size={17}
                            onPress={() => setAddContactOL(true)}>
                            </Icon>
                        </View>
                    </LinearGradient>

                    <Overlay
                        isVisible={deleteContactOL}
                        onBackdropPress={() => setDeleteContactOL(false)}
                        fullScreen={false}>
                            <View style={{alignItems:'center', paddingBottom:10}}>
                                <Text style={{fontSize: 17,fontWeight:'bold'}}>Are you sure you want</Text>
                                <Text style={{fontSize:17, fontWeight:'bold'}}>to delete this?</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flexDirection:'row'}}>
                                    <Button
                                    title="Cancel"
                                    type='clear'
                                    onPress={() => {setDeleteContactOL(false);}}>
                                    </Button>
                                </View>
                                <View style={{flexDirection:'row', marginLeft:50}}>
                                    <Button
                                    title="Yes"
                                    type='clear'
                                    onPress={() => {setDeleteContactOL(false); deleteContact();}}>
                                    </Button>
                                </View>
                            </View>
                    </Overlay>

                    <Overlay
                    isVisible={addContactOL}
                    onBackdropPress={() => {setAddContactOL(false); setEmergencyContact(initialState);}}
                    fullScreen={false}
                    overlayStyle={{marginTop:100, marginBottom:100}}>
                        <View style={{alignItems:'center', paddingBottom:10}}>
                            <Text style={{fontSize: 17,fontWeight:'bold'}}>Add a Contact</Text>
                        </View>
                        <ScrollView style = {{}}>
                            <Text>First Name:</Text>
                            <TextInput
                            style={styles.inputView}
                            onChangeText={(text) => {setEmergencyContact({...emergencyContact, firstName: text});}}>
                            </TextInput>
                            <Text>Last Name:</Text>
                            <TextInput
                            style={styles.inputView}
                            onChangeText={(text) => {setEmergencyContact({...emergencyContact, lastName: text});}}>
                            </TextInput>
                            <Text>Phone Number:</Text>
                            <TextInput
                            style={styles.inputView}
                            onChangeText={(text) => {setEmergencyContact({...emergencyContact, phoneNumber: text});}}>
                            </TextInput>
                            <Text>Email:</Text>
                            <TextInput
                            style={styles.inputView}
                            onChangeText={(text) => {setEmergencyContact({...emergencyContact, email: text});}}>
                            </TextInput>
                            <Text>Relation:</Text>
                            <TextInput
                            style={styles.inputView}
                            onChangeText={(text) => {setEmergencyContact({...emergencyContact, relation: text});}}>
                            </TextInput>
                        </ScrollView>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'row'}}>
                                <Button
                                title="Cancel"
                                type='clear'
                                onPress={() => {setAddContactOL(false); setEmergencyContact(initialState);}}>
                                </Button>
                            </View>
                            <View style={{flexDirection:'row', marginLeft:50}}>
                                <Button
                                title="Submit"
                                type='clear'
                                onPress={() => {setAddContactOL(false);
                                updateEmergencyContactsList();
                                setEmergencyContact(initialState);}}>
                                </Button>
                            </View>
                        </View>
                    </Overlay>
                        
                    <Overlay
                    isVisible={viewOrEditContact}
                    onBackdropPress={() => {setViewOrEditContact(false); setEmergencyContact(initialState);}}
                    fullScreen={false}
                    overlayStyle={{marginTop:100, marginBottom:100}}>
                        <View style={{alignItems:'center', paddingBottom:10}}>
                            <Text style={{fontSize: 17,fontWeight:'bold'}}>Emergency Contact</Text>
                        </View>
                        <ScrollView style = {{}}>
                            <Text>First Name:</Text>
                            <TextInput
                            style={styles.inputView}
                            onChangeText={(text) => {setEmergencyContact({...emergencyContact, firstName: text});}}
                            defaultValue={emergencyContact.firstName}
                            editable={editContact}>
                            </TextInput>
                            <Text>Last Name:</Text>
                            <TextInput
                            style={styles.inputView}
                            onChangeText={(text) => {setEmergencyContact({...emergencyContact, lastName: text});}}
                            defaultValue={emergencyContact.lastName}
                            editable={editContact}>
                            </TextInput>
                            <Text>Phone Number:</Text>
                            <TextInput
                            style={styles.inputView}
                            onChangeText={(text) => {setEmergencyContact({...emergencyContact, phoneNumber: text});}}
                            defaultValue={emergencyContact.phoneNumber}
                            editable={editContact}>
                            </TextInput>
                            <Text>Email:</Text>
                            <TextInput
                            style={styles.inputView}
                            onChangeText={(text) => {setEmergencyContact({...emergencyContact, email: text});}}
                            defaultValue={emergencyContact.email}
                            editable={editContact}>
                            </TextInput>
                            <Text>Relation:</Text>
                            <TextInput
                            style={styles.inputView}
                            onChangeText={(text) => {setEmergencyContact({...emergencyContact, relation: text});}}
                            defaultValue={emergencyContact.relation}
                            editable={editContact}>
                            </TextInput>
                        </ScrollView>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'row'}}>
                                <Button
                                title="Cancel"
                                type='clear'
                                onPress={() => {setViewOrEditContact(false); setEditContact(false); setEmergencyContact(initialState);}}>
                                </Button>
                            </View>
                            
                            <View style={{flexDirection:'row', marginLeft:50}}>
                            {!editContact ?
                                <Button
                                title="Edit"
                                type='clear'
                                onPress={() => {setEditContact(true)}}>
                                </Button>
                            :
                                <Button
                                title="Save"
                                type='clear'
                                onPress={() => {setViewOrEditContact(false); setEditContact(false); editEmergencyContactsList(); setEmergencyContact(initialState);}}>
                                </Button>}
                            </View>
                        </View>
                    </Overlay>

                    <Divider style={{backgroundColor:'#c8c8c8', paddingBottom:15}}></Divider>

                    <Overlay
                        isVisible={deleteOL}
                        onBackdropPress={() => setDeleteOL(false)}
                        fullScreen={false}>
                            <View style={{alignItems:'center', paddingBottom:10}}>
                                <Text style={{fontSize: 17,fontWeight:'bold'}}>Are you sure you want</Text>
                                <Text style={{fontSize:17, fontWeight:'bold'}}>to delete this?</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flexDirection:'row'}}>
                                    <Button
                                    title="Cancel"
                                    type='clear'
                                    onPress={() => {setDeleteOL(false);}}>
                                    </Button>
                                </View>
                                <View style={{flexDirection:'row', marginLeft:50}}>
                                    <Button
                                    title="Yes"
                                    type='clear'
                                    onPress={() => {setDeleteOL(false); deleteAllergy();}}>
                                    </Button>
                                </View>
                            </View>
                        </Overlay>
                    <KeyboardAvoidingView>
                    <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style= {{flex:5, backgroundColor:'white', borderRadius:15}}>
                        <List.Accordion
                        title="Additonal Information">
                        
                            <ListItem bottomDivider>
                                <ListItem.Content style={{flex:1}}>
                                    <View style={{flex:1, justifyContent:'center', borderRadius:15}}>
                                        <TextInput
                                        style={styles.descriptionView}
                                        multiline={true}
                                        defaultValue={additionalInformation}
                                        onChangeText={setAdditionalInformation}>
                                        </TextInput>
                                    </View>
                                </ListItem.Content>
                            </ListItem>
                        </List.Accordion>
                    </LinearGradient>
                    </KeyboardAvoidingView>
                    <View style={{flex:1, flexDirection:'row', justifyContent:'center', paddingTop:15}}>
                    {!create ?
                        <Button
                        title="Save Changes"
                        type='solid'
                        onPress={() => {updateHealthProfile();}}>
                        </Button>
                        :
                        <Button
                        title="Save Changes"
                        type='solid'
                        onPress={() => {createHealthProfile(); setCreate(false);}}>
                        </Button>
                    }
                    </View>
                </ScrollView>
            </SafeAreaProvider>
        </View>
    );
}

export default EditHealth;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
        //justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor:'#c8c8c8',//'#9a999a',//'#eae9eb'
        paddingTop:30
    },
    overlayContainer: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'column',
        marginTop: 100,
        marginBottom:300,
    },
    inputView:{
        width: 185,
        backgroundColor:"gray",
        //borderRadius:20,
        height:40,
        marginBottom:20,
        justifyContent:'center',
        paddingLeft:13,
        paddingBottom: 3,
      },
      descriptionView:{
        width: 335,
        backgroundColor:"gray",
        borderRadius:15,
        height:100,
        marginBottom:20,
        justifyContent:'center',
        paddingLeft:13,
        paddingBottom: 3
      },
      bottomView:{
        flexDirection:'row-reverse',
        backgroundColor:'white',
        borderBottomEndRadius:15, 
        borderBottomStartRadius:15
      }
});