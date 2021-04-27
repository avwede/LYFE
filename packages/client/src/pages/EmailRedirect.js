import React, { Component, useState } from "react";
import axios from 'axios';
import { buildPath } from '../components/bp';
import { retrieveToken } from '../tokenStorage';

class EmailRedirect extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            result: '',
        }
    }

    componentDidMount() {
        const path = window.location.pathname;
        var splitPath = path.split('/');
        const token = splitPath[2];
        console.log(token);
        axios
      .post(buildPath(`api/users/verify/${token}`), {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ result: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
    }
    render(){
        return (
            <div className="inner">
                <div>
                    <h1 style={{textAlign: 'center'}}>Welcome to LYFE!</h1>
                    <h3>Your email has been successfully verified.</h3>
                </div>
            </div>
        );
    }
    
}

export default EmailRedirect;