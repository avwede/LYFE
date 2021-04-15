import React, { Component } from "react";
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, HomeOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { Tooltip, Progress, Button, Card, Row, Col, Form, Input, InputNumber } from 'antd';
import ReactDOM from 'react-dom';
import logo from "../logo.png";

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

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
    
    render () {
        return (            
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <div className="site-card-wrapper">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                        
                        <Card title="Profile" bordered={false}>
                            <img className="Header" src={logo} alt="Logo" />
                            
                            <Form {...layout} name="nest-messages" validateMessages={validateMessages}>
                                <Form.Item
                                    name={['user', 'name']}
                                    label="Name"
                                    rules={[
                                    {
                                        required: true,
                                    },
                                    ]}
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
                                <Form.Item
                                    name={['user', 'age']}
                                    label="Age"
                                    rules={[
                                    {
                                        type: 'number',
                                        min: 0,
                                        max: 99,
                                    },
                                    ]}
                                >
                                    <InputNumber />
                                </Form.Item>
                                <Form.Item name={['user', 'website']} label="Website">
                                    <Input />
                                </Form.Item>
                                <Form.Item name={['user', 'introduction']} label="Introduction">
                                    <Input.TextArea />
                                </Form.Item>
                                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                    <Button type="primary" htmlType="submit">
                                    Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                            
                        </Card>
                        </Col>
                    </Row>
                    
                </div>
            </Content>

        );
    };        
}


export default DashboardProfile;