import React, { Component } from "react";
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001/api/users'
})

export default class LoginPage extends Component{

    // state = {
    //     email: '',
    //     password: '',
    // }
    
    // onEmailChange = email => {
    //     this.setState({email});
    // };
    
    // onPasswordChange = password => {
    //     this.setState({password});
    // };

    doLogin = async() => {
        //const {email, password} = this.state;
        // let res = await api.post('/login', {email : 'avwede@gmail.com', password : 'Pw@12345678'}).then((response) => {
        //     console.log(response)
        // })

        console.log("are we here?");


        api.post('/login', {
            email: "avwede@gmail.com",
            password: "Pw@12345678"
        })
        .then(response => { 
            console.log("got the response")
            console.log(response)
        })
        .catch(error => {
            console.log("got the err")
            console.log(error)
        });
    }

    render() {
        return (
        
        <div className="inner">
            <form>
                <h3>Log In</h3>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" id = 'email' className="form-control" placeholder="Enter email"/>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" id = 'password' className="form-control" placeholder="Enter password"/>
                </div>

                <button type="Button" className="btn btn-dark btn-lg btn-block" onClick={this.doLogin}> Sign in </button>

                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
            </form>
        </div>
        );
    }
}

