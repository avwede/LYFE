import React, { Component } from "react";
import logo from '../logoWhite.png';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Layout, Menu, Breadcrumb } from 'antd';

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    Redirect
  } from "react-router-dom";

const { Header, Content, Footer } = Layout;

export default class HeaderDashboard extends Component{
    render() {
        return(
            <Header theme='dark' style={{ width: '100%', height: '100%', textAlign: 'center'}}>
                <Link className="navbar-brand" to={"/Dashboard"}>
                    <img className="Header" src={logo} style={{width: '70%', height: '70%'}} alt="Logo" />
                </Link>
            </Header>
        );
    }
}
