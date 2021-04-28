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
  
class DashboardProfile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        firstName: '',
        lastName: '',
        email: '',
      };

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
            this.setState({ 
              firstName: res.data.firstName, 
              lastName: res.data.lastName,
              email: res.data.email,
            });
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
                                <Col span={12}>
                                    <img className="Header" src={profilePic} style={{margin: '50px', width: '604px', height: '392px'}} alt="Logo" />
                                </Col>
                                <Col span={12} >

                                <h3 style={{fontWeight: 'bold', paddingTop:'160px'}}> First Name: {this.state.firstName}</h3>
                                <h3 style={{fontWeight: 'bold'}}> Last Name: {this.state.lastName}</h3>
                                <h3 style={{fontWeight: 'bold'}}> Email: {this.state.email}</h3>
                                <Button type="primary">
                                  <a href="/Home">Logout</a>
                                </Button>

                                    {/* <Form {...layout} name="nest-messages" style={{paddingTop:'85px'}}>
                                        <Form.Item
                                            name={['user', 'firstName']}
                                            label="First Name"
                                        >

                                            {console.log(this.state.firstName)}
                                            <Input name="firstName" value={this.state.firstName}/>

                                        </Form.Item>
                                        <Form.Item
                                            name={['user', 'lastName']}
                                            label="Last Name"
                                        >
                                            {console.log(this.state.lastName)}
                                            <Input name="lastName" value={this.state.lastName}/>
                                        </Form.Item>
                                        <Form.Item
                                            name={['user', 'email']}
                                            label="Email"
                                        >
                                            {console.log(this.state.email)}
                                            <Input name="email" value={this.state.email}/>
                                        </Form.Item>
                                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }} style={{paddingBottom:'85px'}}>
                                            
                                        </Form.Item>
                                    </Form> */}
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