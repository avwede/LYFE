import React, { Component, useState } from "react";
import axios from 'axios';
import { buildPath } from '../components/bp';
import { retrieveToken } from '../tokenStorage';

function EmailRedirect () {
    const storage = require('../tokenStorage.js');
    const bp = require('../components/bp.js');

	var password;

	const [message, setMessage] = useState('');

	const verifyEmail = async event => {
		event.preventDefault();

		var obj = {password: password.value };
		var js = JSON.stringify(obj);
        const path = window.location.pathname;
        var splitPath = path.split('/');
        const token = splitPath[2];
        console.log(token);

		try {
			var config = {
				method: 'post',
				url: bp.buildPath(`api/users/verify/${token}`), //'http://localhost:3001/api/users/register', 
				headers: {
					'Content-Type': 'application/json'
				},
				data: js

			};

			axios(config)
				.then(function (response) {
					var res = response.data;

					if (res.error) {
						setMessage("Error");

					} else {
						storage.storeToken(res);
						setMessage("Your account has successfully been verified.")
						// window.location.href = './VerifiedSuccess';
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
              <div>
                  <h1 style={{textAlign: 'center'}}>Welcome to LYFE!</h1>
                  
                  <h4 style={{textAlign: 'center'}}>Please enter your password to verify your account.</h4>

                  <div className="form-group">
                    <input type="password" id = 'password' className="form-control" placeholder="Enter password" ref={(c) => password = c} />
                </div>

                <button type="submit" onClick={verifyEmail} className="btn btn-dark btn-lg btn-block" style={{marginBottom: '20px'}}>Verify Account!</button>
				<span id="loginResult" style={{color: 'black', fontWeight: 'bold'}}>{message}</span>

			  
			  </div>
          </div>
      );
  
    
}

export default EmailRedirect;