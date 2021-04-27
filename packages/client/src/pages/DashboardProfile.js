import React from "react";
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import { Button, Card, Row, Col, Form, Input } from 'antd';
import profilePic from "../profile.png";
import { retrieveToken } from '../tokenStorage';
import { buildPath } from '../components/bp'
import axios from 'axios';

import LoginPage from "./Login";
import { Link } from "react-router-dom";

const { Content } = Layout;

const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  
const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };



class DashboardProfile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        profile: [],
      };

    }

      componentDidMount() {
        axios
          .get(buildPath('api/reminders/'), {
            headers: {
              Authorization: `Bearer ${retrieveToken()}`,
              'Content-Type': 'application/json',
            },
          })
          .then((res) => {
            this.setState({ tasks: res.data });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      
    render () {
        return (            
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <div className="site-card-wrapper">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                        
                        <Card title="Profile" bordered={false}>
                            <Row gutter={[16, 16]}>
                                <Col span={4}>
                                    <img className="Header" src={profilePic} style={{margin: '50px', width: '322px', height: '216px'}} alt="Logo" />
                                </Col>
                                
                                <Col span={20}>
                                    <Form {...layout} name="nest-messages" validateMessages={validateMessages} style={{paddingTop:'85px'}}>
                                        <Form.Item
                                            name={['user', 'firstName']}
                                            label="First Name"
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={['user', 'lastName']}
                                            label="Last Name"
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={['user', 'email']}
                                            label="Email"
                                            rules={[
                                            {
                                                type: 'email',
                                            },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item name={['user', 'password']} label="Password">
                                            <Input />
                                        </Form.Item>
                                    
                                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }} style={{paddingBottom:'85px'}}>
                                            <Button type="primary">
                                              <a href="/Home">Logout</a>
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Row>
                            
                        </Card>
                        
                        </Col>
                        
                    </Row>
                    
                </div>
            </Content>

        );
    };        
}


export default DashboardProfile;