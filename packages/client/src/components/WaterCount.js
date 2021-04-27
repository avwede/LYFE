import React from 'react';
import 'antd/dist/antd.css';
import { Progress, Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

import { retrieveToken } from '../tokenStorage';
import { buildPath } from './bp'
import axios from 'axios';


class WaterCount extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      percent: 0,
      water: 0,
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
      this.setState({ water: res.data.waterCount });
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  
  updateWaterCount = (percent) => {
    const newWater = {
      waterCount : percent,
    }

    axios
    .put(buildPath('api/users/'), newWater, {
      headers: {
        Authorization: `Bearer ${retrieveToken()}`,
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      this.setState({ water: res.data.waterCount });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  
  increase = () => {
    var percent = 10 + this.state.water;
    console.log(percent);
    if (percent > 100) {
      percent = 100;
    }
    this.setState({ percent: percent });
    this.updateWaterCount(percent);
  };

  decline = () => {
    var percent = this.state.water - 10;
    if (percent < 0) {
      percent = 0;
    }
    this.setState({ percent: percent});
    this.updateWaterCount(percent);
  };

  render() {
    return (
      <>
        <h5>Daily Water Tracker</h5>
        <Progress strokeColor={{'0%': '#ACC1FF', '100%': '#9CECFF',}} type="circle" percent={this.state.water} format={percent => `${percent / 10} Cups`}/>
        
        <Button.Group style={{margin: 30}}>
          <Button onClick={this.decline} icon={<MinusOutlined />} />
          <Button onClick={this.increase} icon={<PlusOutlined />} />
        </Button.Group>
      </>
    );
  }
}

export default WaterCount;