import React, { Component } from "react";
import logo from '../logo2.png';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    Redirect
  } from "react-router-dom";

export default class Header extends Component{
    render() {
        return(
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
            <div className="container" style={{justifyContent: 'center'}}>
            <Link className="navbar-brand" to={"/Dashboard"}>
                <img className="Header" src={logo} style={{width: '70%', height: '70%'}} alt="Logo" />
            </Link>
            </div>
        </nav>
        );
    }
}
