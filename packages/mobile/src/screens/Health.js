import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, Share, TextInput, ScrollView, TouchableOpacity, Dimensions, KeyboardAvoidingView, TouchableNativeFeedback} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { List } from 'react-native-paper';
import { ListItem, Divider, Icon, Overlay, Button, Input } from 'react-native-elements';
import {Picker} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import {JWTContext} from '../contexts/JWTContext.js'
import { useFocusEffect } from '@react-navigation/native';

const Health = ({navigation}) => {
    
    const jwt = useContext(JWTContext);
    
    const [index, setIndex] = useState(0);

    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [type, setType] = useState();
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

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

    const isEmpty = (object) => { for(var i in object) { return false; } return true; };
    
    const getHealthProfile = async() => {
        console.log("calling getHealthProfile");
        const resp = await axios.get("https://lyfe--app.herokuapp.com/api/health", 
        {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} });
        console.log(resp.data);
        if(isEmpty(resp.data))
        {
            console.log("it's empty");
        }
        else
        {
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

    const setContactToView = (i) => {
        setEmergencyContact(emergencyContactsList[i]);
    }

    const setMedicationToView = (i) => {
        setMedication(medicationList[i]);
    }

    const formatDate = (date, time) => {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`;
    };

    const formatDateString = () => {
        const dateCheck = new Date(dateOfBirth);
        return `${dateCheck.getMonth() + 1}/${dateCheck.getDate()}/${dateCheck.getFullYear()}`;
    }

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    useFocusEffect(
        React.useCallback(() => {
          getHealthProfile();
        }, [])
      );

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

    const createMsg = () => {
        let msg = `Hello! Here is my health profile:
        
`;
        
            msg += `Date of Birth: ${formatDateString()}
Height: ${height}
Weight: ${weight}
Gender: ${gender}
Blood Type: ${bloodType}

Allergies: ${allergyList.join(', ')}

Health Conditons: ${healthConditionsList.join(', ')}

Medications: `;

for (let i = 0; i < medicationList.length; i++)
{
    msg += `${i+1}: ${(medicationList[i].name)}, ${(medicationList[i].dosage)} ${(medicationList[i].frequency)}
`;
}

msg += `Additional Info: ${additionalInformation}
`
        return msg;
    }


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
                                        <Text>{formatDateString()}</Text>
                                        {/* <TextInput
                                        editable={false}
                                        style={styles.inputView}
                                        defaultValue={dateOfBirth}
                                        onChangeText={setDOB}>
                                        </TextInput> */}
                                    </View>
                                </ListItem.Content>
                            </ListItem>
                            <ListItem bottomDivider>
                                <ListItem.Content style={{flex:1, flexDirection:'row'}}>
                                    <View style={{flex:1}}>
                                        <ListItem.Title>Height (inches):</ListItem.Title>
                                    </View>
                                    <View style={{flex:1, flexDirection:'row-reverse'}}>
                                        <Text style={{fontSize:15}}>{height?.toString()}</Text>
                                        {/* <TextInput
                                        editable={false}
                                        style={styles.inputView}
                                        defaultValue={height.toString()}
                                        onChangeText={setHeight}>
                                        </TextInput> */}
                                    </View>
                                </ListItem.Content>
                            </ListItem>
                            <ListItem bottomDivider>
                                <ListItem.Content style={{flex:1, flexDirection:'row'}}>
                                    <View style={{flex:1}}>
                                        <ListItem.Title>Weight (lbs):</ListItem.Title>
                                    </View>
                                    <View style={{flex:1, flexDirection:'row-reverse'}}>
                                        <Text style={{fontSize:15}}>{weight?.toString()}</Text>
                                        {/* <TextInput
                                        editable={false}
                                        style={styles.inputView}
                                        defaultValue={weight.toString()}
                                        onChangeText={setWeight}>
                                        </TextInput> */}
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
                                        enabled={false}
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
                                        enabled={false}
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
                            allergyList?.map((l,i) => (
                                <ListItem key={i}
                                bottomDivider
                                onPress={() => {setIndex(i); setViewOrEditAllergyOL(true);}}
                                onLongPress={() => {setIndex(i);}}>
                                <ListItem.Content>
                                    <ListItem.Title>{l}</ListItem.Title>
                                </ListItem.Content>
                                <ListItem.Chevron/>
                            </ListItem>
                            ))
                        }
                        </List.Accordion>
                    </LinearGradient>

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
                                defaultValue={allergyList? allergyList[index] : undefined}
                                editable={editAllergy}
                                >
                                </TextInput>
                            </View>
                        </Overlay>

                    <Divider style={{backgroundColor:'#c8c8c8', paddingBottom:15}}></Divider>

                    <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style= {{flex:5, backgroundColor:'white', borderRadius:15}}>
                        <List.Accordion
                        title="Health Conditions"
                        style={{}}>
                            {
                            healthConditionsList?.map((l,i) => (
                                <ListItem key={i} 
                                bottomDivider
                                onPress={() => {setIndex(i); setViewOrEditHealthConditionOL(true);}}
                                onLongPress={() => {setIndex(i);}}>
                                <ListItem.Content>
                                    <ListItem.Title>{l}</ListItem.Title>
                                </ListItem.Content>
                                <ListItem.Chevron/>
                            </ListItem>
                            ))
                        }
                        </List.Accordion>
                    </LinearGradient>

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
                                defaultValue={healthConditionsList ? healthConditionsList[index] : undefined}
                                editable={editHealthCondition}
                                >
                                </TextInput>
                            </View>
                        </Overlay>

                    <Divider style={{backgroundColor:'#c8c8c8', paddingBottom:15}}></Divider>

                    <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style= {{flex:5, backgroundColor:'white', borderRadius:15}}>
                        <List.Accordion
                        title="Medications">
                            {
                            medicationList?.map((l,i) => (
                                <ListItem key={i} 
                                bottomDivider
                                onPress={() => {setIndex(i); setMedicationToView(i); setViewOrEditMedicationOL(true);}}
                                onLongPress={() => {setIndex(i);}}>
                                <ListItem.Content>
                                    <ListItem.Title>{l.name}</ListItem.Title>
                                    <ListItem.Subtitle>{l.dosage} {l.frequency}</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron/>
                            </ListItem>
                            ))
                        }
                        </List.Accordion>
                    </LinearGradient>
                    <Overlay
                    isVisible={viewOrEditMedicationOL}
                    onBackdropPress={() => {setViewOrEditMedicationOL(false); setMedication(initialMedicationState);}}
                    fullScreen={false}
                    overlayStyle={{marginTop:100, marginBottom:300}}>
                        <View style={{alignItems:'center', paddingBottom:10}}>
                            <Text style={{fontSize: 17,fontWeight:'bold'}}>Medication</Text>
                        </View>
                        <ScrollView style = {{}}>
                        <Text>Name:</Text>
                            <TextInput
                            style={styles.inputView}
                            editable={editMedication}
                            defaultValue={medication?.name}
                            onChangeText={(text) => {setMedication({...medication, name: text});}}>
                            </TextInput>
                            <Text>Dosage:</Text>
                            <TextInput
                            style={styles.inputView}
                            editable={editMedication}
                            defaultValue={medication?.dosage}
                            onChangeText={(text) => {setMedication({...medication, dosage: text});}}>
                            </TextInput>
                            <Text>Frequency:</Text>
                            <TextInput
                            style={styles.inputView}
                            editable={editMedication}
                            defaultValue={medication?.frequency}
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
                    </Overlay>        
                    <Divider style={{backgroundColor:'#c8c8c8', paddingBottom:15}}></Divider>

                    <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style= {{flex:5, backgroundColor:'white', borderRadius:15}}>
                        <List.Accordion
                        title="Emergency Contacts">
                            {
                            emergencyContactsList?.map((l,i) => (
                                <ListItem key={i} 
                                bottomDivider
                                onPress={() => {setIndex(i); setContactToView(i); setViewOrEditContact(true);}}
                                onLongPress={() => {setIndex(i);}}>
                                <ListItem.Content>
                                    <ListItem.Title>{l?.firstName} {l?.lastName}</ListItem.Title>
                                </ListItem.Content>
                                <ListItem.Chevron/>
                            </ListItem>
                            ))
                        }
                        </List.Accordion>
                    </LinearGradient>
                        
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
                            defaultValue={emergencyContact?.firstName}
                            editable={editContact}>
                            </TextInput>
                            <Text>Last Name:</Text>
                            <TextInput
                            style={styles.inputView}
                            defaultValue={emergencyContact?.lastName}
                            editable={editContact}>
                            </TextInput>
                            <Text>Phone Number:</Text>
                            <TextInput
                            style={styles.inputView}
                            defaultValue={emergencyContact?.phoneNumber}
                            editable={editContact}>
                            </TextInput>
                            <Text>Email:</Text>
                            <TextInput
                            style={styles.inputView}
                            defaultValue={emergencyContact?.email}
                            editable={editContact}>
                            </TextInput>
                            <Text>Relation:</Text>
                            <TextInput
                            style={styles.inputView}
                            defaultValue={emergencyContact?.relation}
                            editable={editContact}>
                            </TextInput>
                        </ScrollView>
                    </Overlay>

                    <Divider style={{backgroundColor:'#c8c8c8', paddingBottom:15}}></Divider>

                    <KeyboardAvoidingView>
                    <LinearGradient colors={['#ACC1FF', '#9CECFF', '#DBF3FA']} style= {{flex:5, backgroundColor:'white', borderRadius:15}}>
                        <List.Accordion
                        title="Additional Information">
                            <ListItem bottomDivider>
                                <ListItem.Content style={{flex:1}}>
                                    <View style={{flex:1, justifyContent:'center', borderRadius:15}}>
                                        <TextInput
                                        style={styles.descriptionView}
                                        multiline={true}
                                        defaultValue={additionalInformation}
                                        editable={false}>
                                        </TextInput>
                                    </View>
                                </ListItem.Content>
                            </ListItem>
                        </List.Accordion>
                    </LinearGradient>
                    </KeyboardAvoidingView>
                    <View style={{flex:1, flexDirection:'row', justifyContent:'center', paddingTop:15}}>
                        <Button
                        title="Edit Health Profile"
                        type='solid'
                        onPress={() => {navigation.navigate('Edit Health Profile')}}
                        >
                        </Button>
                    </View>
                    <View style={{flex:1, flexDirection:'row', justifyContent:'center', paddingTop:5}}>
                    <Button type='solid'
                        onPress={() => onShare()} title="Share">
                        <Text >Share Reminders</Text>
                    </Button>
                    </View>
                </ScrollView>
            </SafeAreaProvider>
        </View>
    );
}

export default Health;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
        //justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor:'#c8c8c8',//'#9a999a',//'#eae9eb'
        paddingTop:15
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