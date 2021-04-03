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
import DashboardPage from "./pages/Dashboard";
import HomePage from "./pages/Home";
import Header from "./components/Header";


function App(){
  return (
      <Router>
            <Switch>      
            <Route exact path = "/Dashboard" component={DashboardPage} />

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
