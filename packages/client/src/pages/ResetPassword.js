import React, { Component, useState } from "react";
import axios from 'axios';

function ResetPassword () {
        return (
            <div className="inner">
                <form>
                    <h3>Enter your new password</h3>
    
                    <div className="form-group">
                        <input type="password" id = 'password' className="form-control" placeholder="Enter new password" />
                    </div>
    
                    <button type="submit" className="btn btn-dark btn-lg btn-block" style={{marginBottom: '20px'}}>Reset Password</button>
                    <span id="loginResult" style={{color: 'red', fontWeight: 'bold'}}></span>
    
                </form>
    
                
            </div>
        );
}

export default ResetPassword;