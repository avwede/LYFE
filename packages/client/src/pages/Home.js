import React, { Component } from "react";
import styled from "styled-components";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Paper } from '@material-ui/core';
import './Home.css';
import '../App.css';
import ReactTypingEffect from 'react-typing-effect';

export default function HomePage() {
    return (
        <div className='hero-container'>
            <video src='/videos/lyfeVideo.mp4' autoPlay loop muted />
            <h1>LYFE AWAITS</h1>
            
            <p>Get organized with our all-in-one <ReactTypingEffect text={["school", "health", "life"]} speed="250" eraseDelay="500" typingDelay="500" />manager for students.</p>
            <div className='hero-btns'>
            <Button variant="contained" size="large" href="/Register">
                Sign Up Today
            </Button>
        </div>
      </div>                  
    );
}
