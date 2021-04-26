import React from "react";
import 'antd/dist/antd.css';
import { Card, Row, Col, Carousel, Statistic, Layout, TimePicker, Menu, Button } from 'antd';
import classesPic from '../classes.png';
import moment from 'moment';

import ClassesSchool from '../components/ClassesSchool';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: 'linear-gradient(to right, #ACC1FF, #9CECFF)',
  };

const { Countdown } = Statistic;

function onFinish() {
    console.log('finished!');
}

const now = moment();


class DashboardSchool extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          time: 0,
        };
      }
    
    handleButtonClickFifteenMinutes(time) {
        clearInterval(this.state.time);
        var fifteenMinutes = Date.now() + 900000;
        this.setState({ time: fifteenMinutes })
    }
    
    handleButtonClickThirtyMinutes(time) {
        clearInterval(this.state.time);
        var thirtyMinutes = Date.now() + 1800000;
        this.setState({ time: thirtyMinutes })
    }
    
    handleButtonClickFortyFiveMinutes(time) {
        clearInterval(this.state.time);
        var fortyFiveMinutes = Date.now() + 2700000;
        this.setState({ time: fortyFiveMinutes })
    }

    handleButtonClickSixtyMinutes(time) {
        clearInterval(this.state.time);
        var sixtyMinutes = Date.now() + 3600000;
        this.setState({ time: sixtyMinutes })
    }


    render () {
        return (

            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <div className="site-card-wrapper">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Carousel autoplay>
                                <div  >
                                <h3 style={contentStyle}>"JUST DO IT" - Shia Labeouf</h3>
                                </div>
                                <div>
                                <h3 style={contentStyle}>"How can mirrors be real if our eyes aren't real?"" - Jayden Smith</h3>
                                </div>
                                <div>
                                <h5 style={contentStyle}>"It matters not what you've done but what you do with what you've done.. for others" - Noah Centineo</h5>
                                </div>
                                <div>
                                <h3 style={contentStyle}>"NO RAGRETS" - Scotty P</h3>
                                </div>
                            </Carousel>
                        </Col>
                    </Row>
                    
                    <Row gutter={[16, 16]} >
                        <Col span={24}>
                            <Card title="Manage Your Courses" bordered={false} style={{paddingBottom: '20px'}}>  
                                <ClassesSchool />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} >
                        <Col span={24}>
                            <Card title="Study Timer" bordered={false} >
                            <Row gutter={[16, 16]} >

                                <Col span={5}>
                                    <Button onClick={(e) => this.handleButtonClickFifteenMinutes(e)} type="primary" style={{margin: '10px'}}>15 Minutes</Button>
                                    <Button onClick={(e) => this.handleButtonClickThirtyMinutes(e)} type="primary" style={{margin: '10px'}}>30 Minutes</Button>
                                    <Button onClick={(e) => this.handleButtonClickFortyFiveMinutes(e)} type="primary" style={{margin: '10px'}}>45 Minutes</Button>
                                    <Button onClick={(e) => this.handleButtonClickSixtyMinutes(e)} type="primary" style={{margin: '10px'}}>60 Minutes</Button>
                                </Col>   

                                <Col span={10}>
                                    <Countdown valueStyle={{fontSize: '65px'}} value={this.state.time} onFinish={onFinish} />
                                </Col>
                            </Row>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>

           
        )
    }
}   

export default DashboardSchool;