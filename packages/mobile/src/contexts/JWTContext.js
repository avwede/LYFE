import React, { Component } from 'react';

const JWTContext = React.createContext();

// expo install expo-secure-store
const JWTProvider = (props) => {
    const tokenMethods = {
        setToken: async function(token) {
            await SecureStore.setItemAsync('jwt', token);
        },
        getToken: async function(token) {
            await SecureStore.getItemAsync('jwt', token);
        },
        deleteToken: async function(token) {
            await SecureStore.deleteItemAsync('jwt');
        }
    }
    return <JWTContext.Provider value={tokenMethods}>
        {props.children}</JWTContext.Provider>;
}

export { JWTProvider, JWTContext};