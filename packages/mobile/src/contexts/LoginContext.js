import React, { useState, Component } from 'react';

const LoginContext = React.createContext({
    loggedIn: false,
});

/*const LoginProvider = (props) => {
    const [loggedIn, toggleLoggedIn] = useState(false);
    const logIn = toggleLoggedIn(!loggedIn);
    
    return <LoginContext.Provider value={{loggedIn: loggedIn, logIn: logIn}}>
        {props.children}</LoginContext.Provider>;
}*/

export { LoginContext };