import React, { Component } from "react";
import styled from "styled-components";

import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Paper } from '@material-ui/core';


import lyfeIllustration from "../animation2.png";



export default function HomePage() {
    return (
    
        <div className="homePageBackground">
            <div className="homePageBackgroundFilter">
        
                <Grid container spacing={3} direction="row" alignItems="center" justify="center" style={{ minHeight: '100vh' }}>

                <Grid item xs={6} >
                    
                    <h3>Welcome to LYFE!</h3>
                    <h3>An all in one life manager.</h3>
                
                    <h3><Button variant="contained" href="/Register" size='large'>
                    Join now</Button></h3>
                        
                    
                </Grid>

                
                <div>
                    <img alt ="panda" className='homePageImage' src={lyfeIllustration} />
                </div>
                

                </Grid>

            </div> 
        </div>  
    );
}


