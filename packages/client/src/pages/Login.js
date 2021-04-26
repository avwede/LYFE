import React, { Component, useState } from "react";
import axios from 'axios'

function LoginPage() {

    const storage = require('../tokenStorage.js');
    const bp = require('../components/bp.js');

    var email;
    var password;

    const [message, setMessage] = useState('');
    const [modalShow, setModalShow] = useState(false);


    const doLogin = async event => {

        event.preventDefault();

        var obj = { email: email.value, password: password.value };
        var js = JSON.stringify(obj);

        try {
            var config = {
                method: 'post',
                url: bp.buildPath('api/users/login'), //'http://localhost:3001/api/users/login', 
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

                    } else {
                        console.log(res);
                        storage.storeToken(res);
                        window.location.href = './Dashboard';
                    }

                })
                .catch(function (error) {
                    setMessage(error);

                });


        } catch (e) {
            alert(e.toString());
            return;

        }
    };



    return (
        
        <div className="inner">
            <form>
                <h3>Log In</h3>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" id = 'email' className="form-control" placeholder="Enter email" ref={(c) => email = c} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" id = 'password' className="form-control" placeholder="Enter password" ref={(c) => password = c} />
                </div>

                <button type="submit" className="btn btn-dark btn-lg btn-block" onClick={doLogin}> Sign in </button>

                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
            </form>
        </div>
        );
}

export default LoginPage;
