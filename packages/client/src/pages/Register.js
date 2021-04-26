import React, { Component, useState } from "react";
import axios from 'axios'

function RegisterPage() {

    const storage = require('../tokenStorage.js');
    const bp = require('../components/bp.js');

	var email;
	var password;
	var firstName;
	var lastName;

	const [message, setMessage] = useState('');

	const doRegister = async event => {
		event.preventDefault();

		var obj = { firstName: firstName.value, lastName: lastName.value, email: email.value, password: password.value };
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
						window.location.href = './';
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
                <h3>Register</h3>

                <div className="form-group">
                    <label>First name</label>
                    <input type="text" className="form-control" placeholder="First name"  ref={(c) => firstName = c}/>
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input type="text" className="form-control" placeholder="Last name" ref={(c) => lastName = c}/>
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" placeholder="Enter email" ref={(c) => email = c}/>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" ref={(c) => password = c}/>
                </div>

                <button type="submit" className="btn btn-dark btn-lg btn-block" onClick={doRegister}> Register </button>
                <p className="forgot-password text-right">
                    Already registered <a href="/Login">log in?</a>
                </p>
            </form>
        </div>
    );   
}

export default RegisterPage;