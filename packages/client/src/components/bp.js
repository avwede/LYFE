require("dotenv").config();

exports.buildPath = function ( route )
{
    const app_name = 'lyfe--app';
    if (process.env.NODE_ENV === 'production') 
    {
        return 'https://' + app_name +  '.herokuapp.com/' + route;
    }
    else
    {        
        return 'http://localhost:3001/' + route;
    }
}