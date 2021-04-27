import axios from 'axios';
import React, { Component, useState } from "react";

function ForgetPassword() {

    const storage = require('../tokenStorage.js');
    const bp = require('../components/bp.js');

    var email;
    
    const [message, setMessage] = useState('');

    const sendReset = async event => {

        event.preventDefault();

        var obj = { email: email.value};
        var js = JSON.stringify(obj);

        try {
            var config = {
                method: 'post',
                url: bp.buildPath('api/users/reset'), //'http://localhost:3001/api/users/login', 
                headers: {
                    'Content-Type': 'application/json'
                },
                data: js

            };

            axios(config)
                .then(function (response) {
                    var res = response.data;

                    if (res.error) {
                        setMessage(res.error);
                    } 
                    else {
                        setMessage(res);
                    }

                })
                .catch(function (error) {
                    console.log(error.response.data.error);
                    setMessage(error.response.data.error);

                });


        } catch (e) {
            alert(e.toString());
            return;

        }
    };

    return (
        <div className="inner">
            <form>
                <h2 style={{textAlign: 'center'}}>Forgot your password?</h2>
                <h5 style={{textAlign: 'center', paddingBottom: '30px'}}>Enter your email here to reset your password.</h5>

                <div className="form-group">
                    <input type="email" id = 'email' className="form-control" placeholder="Enter email" ref={(c) => email = c} />
                </div>

                <button type="submit" className="btn btn-dark btn-lg btn-block" style={{marginBottom: '20px'}} onClick = {sendReset}> Send Email Reset Link </button>
                
                <span id="resetsResult" style={{color: 'red', fontWeight: 'bold'}}>{message}</span>

                <p className="resend-email text-right">
                   <a href="#" onClick = {sendReset}>Resend Email</a>
                </p>
            </form>

            
        </div>
        );
}

export default ForgetPassword;