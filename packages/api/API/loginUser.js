// loginUser

const MongoClient = require ('mongodb').MongoClient;
const url = 'mongodb+srv://lyfe:lyfeapp@lyfecluster.arnlc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const client = new MongoClient(url);
client.connect();

app.post('/api/loginUser', async (req, res, next)) =>
{
    // Input: login, password
    // Return: id, firstName, lastName, error

    var error = '';

    const {login, password} = req.body;

    const db = client.db();
    const results = await db.collection('Users').find({Login: login, Password: password}).toArray();

    var id = -1;
    var fn = '';
    var ln = '';

    // If the user exists in the database, store the results.
    if (results.length > 0)
    {
        id = results[0]._id;
        fn = result[0].firstName;
        ln = results[0].lastName;
    }

    var ret = {id: id, firstName: fn, lastName: ln, error: ''};
    res.status(200).json(ret);

}
