import './App.css';
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

import LoginPage from "./pages/Login.component";
import RegisterPage from "./pages/Register.component";
import ErrorPage from "./pages/Error";
import DashboardPage from "./pages/Dashboard";
import Header from "./pages/Header";

function App(){
  return (
      <Router>
       <div className="App">
            <div className="outer">
            <Switch>
            <Route exact path = "/Dashboard" component={DashboardPage} />
            
            <Fragment>
                <Header />
                <Route exact path = "/" component={LoginPage} />
                <Route exact path = "/Login" component={LoginPage} />
                <Route exact path = "/Register" component={RegisterPage} />
                <Route exact path = "/Error" component={ErrorPage} />
            </Fragment>
              
            <Redirect to = "/Error" />
              
              
            </Switch>
           </div>  
        
      </div>
      </Router>
  );
}


export default App;
