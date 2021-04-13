import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Progress, Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

class ExerciseCount extends React.Component {
  state = {
    minutes: 0,
  };

  increase = () => {
    let minutes = this.state.minutes + 10;
    if (minutes > 100) {
      minutes = 100;
    }
    this.setState({ minutes });
  };

  decline = () => {
    let minutes = this.state.minutes - 10;
    if (minutes < 0) {
      minutes = 0;
    }
    this.setState({ minutes });
  };

  render() {
    return (
      <>
        <h5>Daily Exercise Tracker</h5>
        <Progress strokeColor={{'0%': '#ACC1FF', '100%': '#9CECFF',}} type="circle" minutes={this.state.minutes}/>
        
        <Button.Group>
          <Button onClick={this.decline} icon={<MinusOutlined />} />
          <Button onClick={this.increase} icon={<PlusOutlined />} />
        </Button.Group>
      </>
    );
  }
}

export default ExerciseCount;