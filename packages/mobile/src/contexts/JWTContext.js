import React, { Component } from 'react';
import * as SecureStore from 'expo-secure-store';

const JWTContext = React.createContext();

// expo install expo-secure-store
const JWTProvider = (props) => {
    const tokenMethods = {
        setToken: async function(token) {
            return SecureStore.setItemAsync('jwt', token);
        },
        getToken: async function() {
            return SecureStore.getItemAsync('jwt');
        },
        deleteToken: async function(token) {
            return SecureStore.deleteItemAsync('jwt');
        }
    }
    return <JWTContext.Provider value={tokenMethods}>
        {props.children}</JWTContext.Provider>;
}

export { JWTProvider, JWTContext};