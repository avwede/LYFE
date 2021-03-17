// registerUser

const MongoClient = require ('mongodb').MongoClient;
const url = 'mongodb+srv://lyfe:lyfeapp@lyfecluster.arnlc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const client = new MongoClient(url);
client.connect();