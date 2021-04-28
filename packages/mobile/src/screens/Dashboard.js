import React, { useState, useContext, useEffect} from 'react';
import { StyleSheet, Text, View, RefreshControl, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Card, ListItem, Header } from 'react-native-elements';
import {JWTContext} from '../contexts/JWTContext';
import axios from 'axios';

const {width: WIDTH} = Dimensions.get('window')
const Dashboard = (props) => {

    const jwt = useContext(JWTContext);
    
    const [refreshing, setRefreshing] = useState(false);

    const [reminders, setReminders] = useState([]);
    const [courses, setCourses] = useState([]);
    const [medicationList, setMedicationList] = useState([]);

    const [missingCourses, setMissingCourses] = useState(false);
    const [missingMedication, setMissingMedication] = useState(false);
    const [missingReminders, setMissingReminders] = useState(false);

    const getReminders = async () => {
        const resp = await axios.get("https://lyfe--app.herokuapp.com/api/reminders", 
        {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} });
        if(!(resp.data) || resp.data.length === 0)
        {
            setMissingReminders(true);
        }
        else
        {
            setMissingReminders(false);
            setReminders(resp.data.sort(function compare(a, b) {
                var dateA = new Date(a.startDate);
                var dateB = new Date(b.startDate);
                return dateA - dateB;
              }));
        }
        
    }
    const getMedications = async () => {
        const resp = await axios.get("https://lyfe--app.herokuapp.com/api/health", 
        {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} });
        if(!(resp.data.medications) || resp.data.medications.length === 0)
        {
            setMissingMedication(true);
        }
        else
        {
            setMissingMedication(false);
            setMedicationList(resp.data.medications);
        }
    }
    const getCourses = async () => {
        const resp = await axios.get("https://lyfe--app.herokuapp.com/api/users/",
        {headers: {'Authorization' : `Bearer ${await jwt.getToken()}`, 'Content-Type': 'application/json'} });
        if(!(resp.data.courses) || resp.data.courses.length === 0)
        {
            setMissingCourses(true);
        }
        else
        {
            setMissingCourses(false);
            setCourses(resp.data.courses);
        }
    }
    const wait = timeout => {
        return new Promise(resolve => {
          setTimeout(resolve, timeout);
        });
      };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        console.log(jwt.getToken());
        getReminders();
        getMedications();
        getCourses();
        wait(2000).then(() => setRefreshing(false));
      }, []);

    useEffect(() => {
        getReminders();
        getMedications();
        getCourses();
    }, []);

    const formatDateString = (index) => {
        const dateCheck = new Date(reminders[index].startDate);

        return `${dateCheck.getMonth() + 1}/${dateCheck.getDate()}/${dateCheck.getFullYear()} ${dateCheck.getHours()}:${dateCheck.getMinutes() < 10 ? '0' + dateCheck.getMinutes() : dateCheck.getMinutes()}`;
    }
    const formatCourseStartDateString = (index) => {
        const dateCheck = new Date(courses[index].start);

        return `${dateCheck.getHours()}:${dateCheck.getMinutes() < 10 ? '0' + dateCheck.getMinutes() : dateCheck.getMinutes()}`;
    }
    const formatCourseEndDateString = (index) => {
        const dateCheck = new Date(courses[index].end);

        return `${dateCheck.getHours()}:${dateCheck.getMinutes() < 10 ? '0' + dateCheck.getMinutes() : dateCheck.getMinutes()}`;
    }
    const formatCourseDays = (index) => {
        return courses[index].day.join(', ');
    }
    return(
            <SafeAreaProvider style={styles.container}>
                <ScrollView 
                 refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                        <Card containerStyle={{width:315, borderRadius:15}}>
                            <Card.Title>Upcoming Reminders</Card.Title>
                            <Card.Divider/>
                            <View>
                                {!missingReminders ?
                                    reminders.map((l,i) => (
                                        <ListItem key={i}
                                        bottomDivider
                                        >
                                        <ListItem.Content>
                                            <ListItem.Title>{l.name}</ListItem.Title>
                                            <ListItem.Subtitle>{l.description} {formatDateString(i)}</ListItem.Subtitle>
                                        </ListItem.Content>
                                    </ListItem>
                                    ))
                                :
                                    <Text> You currently have no reminders.</Text>
                                }
                            </View>
                        </Card>
                        <Card containerStyle={{width:315, borderRadius:15}}>
                            <Card.Title>Medications to Take</Card.Title>
                            <Card.Divider/>
                            <View>
                            {!missingMedication ?
                                    medicationList.map((l,i) => (
                                        <ListItem key={i}
                                        bottomDivider
                                        >
                                        <ListItem.Content>
                                            <ListItem.Title>{l.name}</ListItem.Title>
                                            <ListItem.Subtitle>{l.dosage} {l.frequency}</ListItem.Subtitle>
                                        </ListItem.Content>
                                    </ListItem>
                                    )) 
                                :
                                    <Text> You currently have no medications to take.</Text>
                            }
                            </View>
                        </Card>
                        <Card containerStyle={{width:315, borderRadius:15}}>
                            <Card.Title>Classes</Card.Title>
                            <Card.Divider/>
                            <View>
                            {!missingCourses ?
                                courses.map((l,i) => (
                                    <ListItem key={i}
                                    bottomDivider
                                    >
                                    <ListItem.Content>
                                        <ListItem.Title>{l.courseCode} </ListItem.Title>
                                        <ListItem.Subtitle>{l.professor} {formatCourseDays(i)} </ListItem.Subtitle>
                                        <ListItem.Subtitle>{formatCourseStartDateString(i)} - {formatCourseEndDateString(i)}</ListItem.Subtitle>
                                    </ListItem.Content>
                                </ListItem>
                                ))
                            :
                                <Text>You currently have no classes.</Text>
                            }
                            </View>
                        </Card>
                </ScrollView>
           </SafeAreaProvider>
    );
}

export default Dashboard;
const styles = StyleSheet.create({
    container: {
        paddingTop:25,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor:'#c8c8c8',//'#f0f0f0'
    },
    logoContainer: {
        alignItems:'center',
        paddingBottom:40,
        marginTop:70
    },
    logo:{
        width: 140,
        height: 140,
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
        alignItems:"center",
        justifyContent:"center",
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