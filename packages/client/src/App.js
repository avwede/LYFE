import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

// React Router for pages
import React, {Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import EmailRedirect from "./pages/EmailRedirect";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

function App(){
  return (
      <Router>
            <Switch>      
            <Route exact path = "/Dashboard" component={Dashboard} />
            <Route exact path = "/Dashboard/Health" component={Dashboard} />
            <Route exact path = "/Dashboard/Home" component={Dashboard} />
            <Route exact path = "/Dashboard/School" component={Dashboard} />
            <Route exact path = "/Dashboard/Profile" component={Dashboard} />

            <Fragment>
                <Header />
                <Route exact path = "/" component={HomePage} />
                <Route exact path = "/Home" component={HomePage} />

                <div className="outer">
                  <Route exact path = "/Login" component={LoginPage} />
                  <Route exact path = "/Register" component={RegisterPage} />
                  <Route exact path = "/Error" component={ErrorPage} />
                  <Route exact path = "/EmailRedirect/:tok" component={EmailRedirect} />
                  <Route exact path = "/ForgetPassword" component={ForgetPassword} />
                  <Route exact path = "/ResetPassword" component={ResetPassword} />
                </div>

            </Fragment>
          
            <Redirect to = "/Error" />
            
            </Switch>
      </Router>
  );
}


export default App;
