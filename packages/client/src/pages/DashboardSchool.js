import React, { Component } from "react";
import 'antd/dist/antd.css';
import { UserOutlined, LaptopOutlined, HomeOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { Tooltip, Progress, Button, Card, Row, Col, Carousel, List, Statistic, Layout, Menu, TimePicker } from 'antd';
import ReactDOM from 'react-dom';
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
var deadline = Date.now();// + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Moment is also OK

function onFinish() {
    console.log('finished!');
}

const now = moment();


class DashboardSchool extends React.Component {
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

                                <Col span={2}>
                                    <TimePicker minuteStep={15} secondStep={10}/>
                                </Col>   

                                <Col span={22}>
                                    <Countdown value={deadline} onFinish={onFinish} />
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