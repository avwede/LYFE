import mongoose from 'mongoose';
const { Schema } = mongoose;

const lyfeSchema = new Schema({
    login: String,
    password: String,
    firstName: String,
    lastName: String,
    emergencyContacts:[
        {
            firstName: String,
            lastName: String, 
            relation: String, 
            phoneNumber: String
        }],
    healthInfo:[
        {
            dateOfBirth: String,
            allergies: [
                {
                    name: String, 
                    schedule: [{day: String}]
                }]
        }],
    classes:[
        {
            className: String,
            schedule: [{day: String}]
        }],
    reminders:[
        {
            category: String,
            schedule: [{day: Date}]
        }]
});