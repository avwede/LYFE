import React from "react";
import 'antd/dist/antd.css';
import { Card, Row, Col, Carousel, Statistic, Layout, TimePicker, Menu, Button } from 'antd';
import classesPic from '../classes.png';
import moment from 'moment';

import ClassesSchool from '../components/ClassesSchool';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

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