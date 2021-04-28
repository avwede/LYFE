import React, { Component, useState } from "react";
import axios from 'axios';

function ResetPassword () {
    const storage = require('../tokenStorage.js');
    const bp = require('../components/bp.js');

	var password;

	const [message, setMessage] = useState('');

	const resetPass = async event => {
		event.preventDefault();

		var obj = {password: password.value};
		var js = JSON.stringify(obj);
        const path = window.location.pathname;
        var splitPath = path.split('/');
        const token = splitPath[2];
        console.log(token);

		try {
			var config = {
				method: 'post',
				url: bp.buildPath(`api/reset/${token}`), //'http://localhost:3001/api/users/register', 
				headers: {
					'Content-Type': 'application/json'
				},
				data: js

			};

			axios(config)
				.then(function (response) {
					var res = response.data;

					if (res.error) {
						setMessage('Error');

					} else {
						setMessage('Password has been reset');
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
                <form>
                    <h3>Enter your new password</h3>
    
                    <div className="form-group">
                        <input type="password" id = 'password' className="form-control" placeholder="Enter new password" />
                    </div>
    
                    <button type="submit" onClick = {resetPass} className="btn btn-dark btn-lg btn-block" style={{marginBottom: '20px'}}>Reset Password</button>
                    <span id="resetResult" style={{color: 'red', fontWeight: 'bold'}}>{message}</span>


					<h3>
                    	<a href="/Login">Return to login.</a>
                	</h3>

    
                </form>
    
                
            </div>
        );
}

export default ResetPassword;