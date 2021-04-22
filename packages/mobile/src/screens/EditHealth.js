import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { List } from 'react-native-paper';
import { ListItem, Divider, Icon, Overlay, Button } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';


const EditHealth = () => {
    const [addAllergyOL, setAddAllergyOL] = useState(false);
    const [addHealthConditionsOL, setAddHealthConditionsOL] = useState(false);
    const [addContactOL, setAddContactOL] = useState(false);
    const [addMedicationOL, setAddMedicationOL] = useState(false);
    const [dateOfBirth, setDOB] = useState(""); // Gen health info
    const [height, setHeight] = useState(""); // gen health info
    const [weight, setWeight] = useState(""); // gen health info
    const [gender, setGender] = useState(""); // gen health info
    const [bloodType, setBloodType] = useState(""); // gen health info
    const [allergyText, setAllergyText] = useState("");
    const [allergyList, setAllergyList] = useState([]); // wrap this in a function and call .concat to update array
    const [healthConditionsText, setHealthConditionsText] = useState("");
    const [healthConditionsList, setHealthConditionsList] = useState([]);
    const [medication, setMedication] = useState(
        {
            name: "",
            dosage: "",
            frequency: "",
            reminder: {
                name: "",
                description: "",
                type: "",
                location: {
                    type: "",
                    location: "",
                },
                startDate: "",
                endDate: "",
                repeat: false,
                dailyPattern:[[""]],
                weeklyPattern: 0,
            }
        }
    );
    const [medicationList, setMedicationList] = useState([
        {
            name: "",
            dosage: "",
            frequency: "",
            reminder: {
                name: "",
                description: "",
                type: "",
                location: {
                    type: "",
                    location: "",
                },
                startDate: "",
                endDate: "",
                repeat: false,
                dailyPattern:[[""]],
                weeklyPattern: 0,
            }
        }
    ]);
    const [emergencyContacts, setEmergencyContacts] = useState(
        {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            relation: ""
        }
    );
    const [emergencyContactsList, setEmergencyContactsList] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        relation: ""    
    });
    const [additionalInformation, setAdditionalInformation] = useState("");
    // add states for each field
    // fetch health profile
    // update health profile
    // // create/get/delete health profile
    const getHealthProfile = () => {
        axios.get("https://test-lyfe-deployment-v2.herokuapp.com/api/users/register", {
            params: {
                // id
            }
    })
    .then(function(response) {
        console.log(response); // assign data to state variables
    })
    .catch(function(error){
        console.log(error);
    })
    }
    const createHealthProfile = () => {
        null;// This will be called if getHealthProfile returns nothing or an error
    }
    const updateHealthProfile = () => {
        null;
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
    const keyExtractor = (item, index) => index.toString()
    const renderGenInfo = ({item}) => {
        return(
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Date of Birth: item.DOB:</ListItem.Title>
                </ListItem.Content>
            </ListItem>
        )
    }
    const list = [
        {
            DOB: "05-24-1999",
            Height: "70 in",
            
        },
    ]
    //padding top for first scrollview is 125, rest of the views had padding bottom 125
    return(
        <View style={styles.container}>
            <SafeAreaProvider>
                <ScrollView style={{flex:1}}>                    
                    <View style= {{flex:5, paddingTop:100}}>
                        <List.Accordion
                        title="General Health Info">
                        {
                            list.map((l,i) => (
                                <ListItem key={i} bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>DOB: {l.DOB}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            ))
                        }
                        </List.Accordion>
                    </View>
                    <Divider style={{backgroundColor:'black'}}></Divider>
                    <View style= {{flex:5}}>
                        <List.Accordion
                        title="Allergies"
                        style={{ backgroundColor:'#ccc9ce'}}>
                        {
                            allergyList.map((l,i) => (
                                <ListItem key={i} bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>{l}</ListItem.Title>
                                </ListItem.Content>
                                <ListItem.Chevron/>
                            </ListItem>
                            ))
                        }
                        </List.Accordion>
                        <View style={{flexDirection:'row-reverse'}}>
                            <Icon
                            raised
                            name='plus'
                            type='font-awesome'
                            color='#f50'
                            onPress={() => setAddAllergyOL(true)}>
                            </Icon>
                        </View>
                    </View>
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
                                onChangeText={updateAllergyText}></TextInput>
                            </View>
                            <View>
                                <Button
                                title="Submit"
                                type='clear'
                                onPress={() => {setAddAllergyOL(false); updateAllergyList(); setAllergyText("");}}>
                                </Button>
                            </View>
                        </Overlay>
                    <Divider style={{backgroundColor:'black'}}></Divider>
                    <ScrollView style= {{flex:5}}>
                        <List.Accordion
                        title="Health Conditions">
                            {
                            healthConditionsList.map((l,i) => (
                                <ListItem key={i} bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>{l}</ListItem.Title>
                                </ListItem.Content>
                                <ListItem.Chevron/>
                            </ListItem>
                            ))
                        }
                        </List.Accordion>
                        <View style={{flexDirection:'row-reverse'}}>
                        <Icon
                            raised
                            name='plus'
                            type='font-awesome'
                            color='#f50'
                            onPress={() => setAddHealthConditionsOL(true)}>
                        </Icon>
                    </View>
                    </ScrollView>
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
                                placeholder= 'Allergy Name'
                                placeholderTextColor='black'
                                underlineColorAndroid='transparent'
                                returnKeyType='next'
                                blurOnSubmit={false}
                                onChangeText={updateHealthConditionsText}></TextInput>
                            </View>
                            <View>
                                <Button
                                title="Submit"
                                type='clear'
                                onPress={() => {setAddHealthConditionsOL(false); updateHealthConditionsList(); setHealthConditionsText("");}}>
                                </Button>
                            </View>
                        </Overlay>
                    <Divider style={{backgroundColor:'black'}}></Divider>
                    <ScrollView style= {{flex:5}}>
                        <List.Accordion
                        title="Medications">
                            {/* <FlatList
                            keyExtractor={}
                            data={}
                            renderItem={}
                            ></FlatList> */}
                            <ListItem bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>YOOOOOOOO</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        </List.Accordion>
                        <View style={{flexDirection:'row-reverse'}}>
                        <Icon
                        raised
                        name='plus'
                        type='font-awesome'
                        color='#f50'
                        onPress={() => setAddMedicationOL(true)}>
                        </Icon>
                    </View>
                    </ScrollView>
                    <Overlay
                        isVisible={addMedicationOL}
                        onBackdropPress={() => setAddMedicationOL(false)}
                        fullScreen={false}
                        overlayStyle={{ marginTop:100, marginBottom:100}}>
                            <View style={{alignItems:'center', paddingBottom:10}}>
                                <Text style={{fontSize: 17,fontWeight:'bold'}}>Add a Medication</Text>
                            </View>
                            <ScrollView style = {{}}>
                                <Text>Name:</Text>
                                <TextInput
                                style={styles.inputView}>
                                </TextInput>
                                <Text>Dosage:</Text>
                                <TextInput
                                style={styles.inputView}>
                                </TextInput>
                                <Text>Frequency:</Text>
                                <TextInput
                                style={styles.inputView}>
                                </TextInput>
                                <Text style={{fontSize:14, fontWeight:'bold', paddingLeft:60}}>Reminder</Text>
                                <Text>Name:</Text>
                                <TextInput
                                style={styles.inputView}>
                                </TextInput>
                                <Text>Description:</Text>
                                <TextInput
                                style={styles.inputView}
                                multiline={true}>
                                </TextInput>
                                <Text>Type:</Text>
                                <TextInput
                                style={styles.inputView}>
                                </TextInput>
                            </ScrollView>
                            <View>
                                <Button
                                title="Submit"
                                type='clear'
                                onPress={() => {setAddMedicationOL(false);}}>
                                </Button>
                            </View>
                        </Overlay>
                    <Divider style={{backgroundColor:'black'}}></Divider>
                    <ScrollView style= {{flex:5}}>
                        <List.Accordion
                        title="Emergency Contacts">
                            {/* <FlatList
                            keyExtractor={}
                            data={}
                            renderItem={}
                            ></FlatList> */}
                            <ListItem bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>YOOOOOOOO</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        </List.Accordion>
                        <View style={{flexDirection:'row-reverse'}}>
                            <Icon
                            raised
                            name='plus'
                            type='font-awesome'
                            color='#f50'
                            onPress={() => setAddContactOL(true)}>
                            </Icon>
                        </View>
                    </ScrollView>
                    <Divider style={{backgroundColor:'black'}}></Divider>
                    <ScrollView style= {{flex:5}}>
                        <List.Accordion
                        title="Additonal Information">
                            {/* <FlatList
                            keyExtractor={}
                            data={}
                            renderItem={}
                            ></FlatList> */}
                        </List.Accordion>
                    </ScrollView>
                </ScrollView>
            </SafeAreaProvider>
        </View>
    );
}

export default EditHealth;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor:'#eae9eb'
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
        paddingLeft:20,
        paddingBottom: 3,
      },
      
});