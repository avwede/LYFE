import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Progress, Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

class ExerciseCount extends React.Component {
  state = {
    percent: 0,
  };

  increase = () => {
    let percent = this.state.percent + 10;
    if (percent > 100) {
      percent = 100;
    }
    this.setState({ percent });
  };

  decline = () => {
    let percent = this.state.percent - 10;
    if (percent < 0) {
      percent = 0;
    }
    this.setState({ percent });
  };

  render() {
    return (
      <>
        <h5 style={{paddingTop: '90px'}}>Daily Exercise Tracker</h5>
        <Progress strokeColor={{'0%': '#ACC1FF', '100%': '#9CECFF',}} type="circle" percent={this.state.percent}/>
        
        <Button.Group style={{margin: 30}}>
          <Button onClick={this.decline} icon={<MinusOutlined />} />
          <Button onClick={this.increase} icon={<PlusOutlined />} />
        </Button.Group>
      </>
    );
  }
}

export default ExerciseCount;