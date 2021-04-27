import React from "react";

class ResetPassword extends React.Component {
    render(){
        return (
            <div className="inner">
                <form>
                    <h3>Enter your new password</h3>
    
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" id = 'password' className="form-control" placeholder="Enter email" />
                    </div>
    
                    <button type="submit" className="btn btn-dark btn-lg btn-block" style={{marginBottom: '20px'}}>Reset Password</button>
                    <span id="loginResult" style={{color: 'red', fontWeight: 'bold'}}></span>
    
                </form>
    
                
            </div>
        );
    }
    
}

export default ResetPassword;