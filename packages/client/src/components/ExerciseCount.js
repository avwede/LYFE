import React from 'react';
import 'antd/dist/antd.css';
import { Progress, Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

import { retrieveToken } from '../tokenStorage';
import { buildPath } from './bp'
import axios from 'axios';


class ExerciseCount extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      percent: 0,
      exercise: 0,
    }
  }

  componentDidMount() {
    axios
    .get(buildPath('api/users/'), {
      headers: {
        Authorization: `Bearer ${retrieveToken()}`,
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      this.setState({ exercise: res.data.exerciseCount });
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  
  updateExerciseAccount = (percent) => {
    const newExercise = {
      exerciseCount : percent,
    }

    axios
    .put(buildPath('api/users/'), newExercise, {
      headers: {
        Authorization: `Bearer ${retrieveToken()}`,
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      this.setState({ exercise: res.data.exerciseCount });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  increase = () => {
    var percent = 10 + this.state.exercise;
    console.log(percent);
    if (percent >= 100) {
      percent = 100;
    }
    this.setState({ percent: percent });
    this.updateExerciseAccount(percent);
  };

  decline = () => {
    var percent = this.state.exercise - 10;
    if (percent < 0) {
      percent = 0;
    }
    this.setState({ percent: percent});
    this.updateExerciseAccount(percent);
  };


  render() {
    return (
      <>
        <h5 style={{paddingTop: '101px'}}>Daily Exercise Tracker</h5>
        <Progress strokeColor={{'0%': '#ACC1FF', '100%': '#9CECFF',}} type="circle" percent={this.state.exercise} format={percent => `${percent/3.333333333333333333333333} Mins`}/>
        
        <Button.Group style={{margin: 30}}>
          <Button onClick={this.decline} icon={<MinusOutlined />} />
          <Button onClick={this.increase} icon={<PlusOutlined />} />
        </Button.Group>
      </>
    );
  }
}

export default ExerciseCount;