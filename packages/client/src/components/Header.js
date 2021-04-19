import React, { Component } from "react";
import logo from '../logo2.png';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';


import { Link } from "react-router-dom";

export default class Header extends Component{
    render() {
        return(
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
            <div className="container">
            <Link className="navbar-brand" to={"/Home"}>
                <img className="Header-logo" src={logo} style={{width: '70%', height: '70%'}} alt="Logo" />
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <Link className="nav-link" to={"/Login"}>Login</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to={"/Register"}>Register</Link>
                </li>
                </ul>
            </div>
            </div>
        </nav>
        );
    }
}
