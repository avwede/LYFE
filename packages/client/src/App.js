import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

// React Router for pages
import React, { Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";

import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import DashboardHealth from "./pages/DashboardHealth";
import DashboardSchool from "./pages/DashboardSchool";
import DashboardProfile from "./pages/DashboardProfile";


function App(){
  return (
      <Router>
            <Switch>      
            <Route exact path = "/Dashboard" component={Dashboard} />

            <Fragment>
                <Header />
                <Route exact path = "/" component={HomePage} />
                <Route exact path = "/Home" component={HomePage} />

                <div className="outer">
                  <Route exact path = "/Login" component={LoginPage} />
                  <Route exact path = "/Register" component={RegisterPage} />
                  <Route exact path = "/Error" component={ErrorPage} />
                </div>
            </Fragment>
          
            <Redirect to = "/Error" />
            
            </Switch>
      </Router>
  );
}


export default App;
