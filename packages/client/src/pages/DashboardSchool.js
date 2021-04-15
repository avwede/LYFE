import React, { Component } from "react";
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, HomeOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { Tooltip, Progress, Button, Card, Row, Col, Carousel  } from 'antd';
import ReactDOM from 'react-dom';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

class DashboardSchool extends React.Component {
    render () {
        return (

            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <div className="site-card-wrapper">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                        <Card title="Motivation" bordered={false}>
                        <Carousel autoplay>
                            <div>
                            <h3 style={contentStyle}>"JUST DO IT" -Shia Labeouf</h3>
                            </div>
                            <div>
                            <h3 style={contentStyle}>"How can mirrors be real if our eyes aren't real?"" - Jayden Smith</h3>
                            </div>
                            <div>
                            <h3 style={contentStyle}>"It matters not what you've done but what you do with what you've done.. for others" -Noah Centineo</h3>
                            </div>
                            <div>
                            <h3 style={contentStyle}>"NO RAGRETS"</h3>
                            </div>
                        </Carousel>
                        </Card>
                        </Col>
                    </Row>
                    
                    <Row gutter={[16, 16]} >
                    <Col span={16}>
                        <Card title="Zoom Links" bordered={false}>
                            
                        </Card>
                    </Col>
                    <Col span={8} >
                        <Card title="Courses" bordered={false}>
                            
                        </Card>
                    </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            
                        </Col>
                    </Row>
                </div>
            </Content>

           
        )
    }
}   

export default DashboardSchool;