import React, { Component } from "react";
import 'antd/dist/antd.css';
import { UserOutlined, LaptopOutlined, HomeOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { Tooltip, Progress, Button, Card, Row, Col, Carousel, List, Statistic, Layout, Menu } from 'antd';
import ReactDOM from 'react-dom';
import classesPic from '../classes.png';



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
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Moment is also OK

function onFinish() {
    console.log('finished!');
  }


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
                            <Card title="Courses" bordered={false} >
                                
                                <Row gutter={[16, 16]}>
                                    <Col span={8}>
                                        <img className="Logo" src={classesPic} style={{ width: '345px', height: '220px'}} alt="Logo" />
                                    </Col>
                                    
                                    <Col span={16}>
                                        <div className="site-card-wrapper">
                                            <Row gutter={16}>
                                                <Col span={8}>
                                                    <Card title="Math" headStyle={{backgroundColor: '#DBF3FA'}} bordered={false}>
                                                        <a href='https://ucf.zoom.us/j/91549966557'>Zoom Meeting Link</a>
                                                    </Card>
                                                </Col>
                                                <Col span={8}>
                                                    <Card title="Science" headStyle={{backgroundColor: '#DBF3FA'}} bordered={false}>
                                                        <a href='https://ucf.zoom.us/j/91549966557'>Zoom Meeting Link</a>
                                                    </Card>
                                                </Col>
                                                <Col span={8}>
                                                    <Card title="History" headStyle={{backgroundColor: '#DBF3FA'}} bordered={false}>
                                                        <a href='https://ucf.zoom.us/j/91549966557'>Zoom Meeting Link</a>
                                                    </Card>
                                                </Col>
                                                <Col span={8}>
                                                    <Card title="Finance" headStyle={{backgroundColor: '#DBF3FA'}} bordered={false}>
                                                        <a href='https://ucf.zoom.us/j/91549966557'>Zoom Meeting Link</a>
                                                    </Card>
                                                </Col>
                                                <Col span={8}>
                                                    <Card title="Computer Science" headStyle={{backgroundColor: '#DBF3FA'}} bordered={false}>
                                                        <a href='https://ucf.zoom.us/j/91549966557'>Zoom Meeting Link</a>
                                                    </Card>
                                                </Col>
                                                <Col span={8}>
                                                    <Card title="Film" headStyle={{backgroundColor: '#DBF3FA'}} bordered={false}>
                                                        <a href='https://ucf.zoom.us/j/91549966557'>Zoom Meeting Link</a>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </div>
                        
                                    </Col>

                                </Row>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} >
                        <Col span={24}>
                            <Card title="Study Timer" bordered={false} >
                                <Countdown title="Countdown" value={deadline} onFinish={onFinish} />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>

           
        )
    }
}   

export default DashboardSchool;