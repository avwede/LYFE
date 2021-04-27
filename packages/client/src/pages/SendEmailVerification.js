import React, { Component, useState } from "react";
import axios from 'axios';

function SendEmailVerification () {
    const storage = require('../tokenStorage.js');
    const bp = require('../components/bp.js');

	var email;

	const [message, setMessage] = useState('');

	const sendReset = async event => {
		event.preventDefault();

        try {
			var config = {
				method: 'get',
				url: bp.buildPath('api/users/register'), //'http://localhost:3001/api/users/register', 
				headers: {
                    'Bearer': storage.retrieveToken(),
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
						email = res.email;
						// window.location.href = './Login';
					}

				})
				.catch(function (error) {
					setMessage(error.response.data.error);

				});


		} catch (e) {
			alert(e.toString());
			return;

		}

		var obj = {email: email.value};
		var js = JSON.stringify(obj);

        
		try {
			var config = {
				method: 'post',
				url: bp.buildPath('api/users/register'), //'http://localhost:3001/api/users/register', 
				headers: {
					'Content-Type': 'application/json'
				},
				data: js

			};

			axios(config)
				.then(function (response) {
					var res = response.data;

					if (res.error) {
						setMessage('User already exists.');

					} else {
						storage.storeToken(res);
						// window.location.href = './Login';
					}

				})
				.catch(function (error) {
					setMessage(error.response.data.error);

				});


		} catch (e) {
			alert(e.toString());
			return;

		}
	};
    
        return (
            <div className="inner">
                    <h3>A verification link has been sent to your email.</h3>
                    <h3><a href="#" onClick = {sendReset}>Resend Email</a></h3>

                
            </div>
        );
}

export default SendEmailVerification;