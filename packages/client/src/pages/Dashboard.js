import React, { Component } from "react";
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, HomeOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { Tooltip, Progress, Button, Card, Row, Col } from 'antd';
import ReactDOM from 'react-dom';

import DashboardHome from "./DashboardHome";
import DashboardHealth from "./DashboardHealth";
import DashboardSchool from "./DashboardSchool";
import DashboardProfile from "./DashboardProfile";
import HeaderDashboard from "../components/HeaderDashboard";

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    Redirect
  } from "react-router-dom";

const { Content, Footer, Sider } = Layout;


const DashboardPage = () => {
  return (
    <Layout>
        <HeaderDashboard />
        <Content style={{ padding: '0 50px' }}>

        <Router>
            <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
                <Sider className="site-layout-background" width={200}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{ height: '100%' }}
                >   
                    <Menu.Item key="sub0" icon={<HomeOutlined />}>Home
                    <Link to= "/Dashboard" />
                    </Menu.Item>

                    <Menu.Item key="sub1" icon={<MedicineBoxOutlined />}>Health
                    <Link to= "/Dashboard/Health" />        
                    </Menu.Item>
                    

                    <Menu.Item key="sub2" icon={<LaptopOutlined />}>School
                    <Link to="/Dashboard/School" />
                    </Menu.Item>

                    <Menu.Item key="sub3" icon={<UserOutlined />}>Profile
                    <Link to= "/Dashboard/Profile" />
                    </Menu.Item>

                </Menu>
                </Sider>        
                
                <Content style={{ padding: '0 50px' }}>
                    <Route exact path='/' component={DashboardHome} />
                    <Route exact path='/Dashboard' component={DashboardHome} />
                    <Route exact path='/Dashboard/Health' component={DashboardHealth} />
                    <Route exact path='/Dashboard/School' component={DashboardSchool} />
                    <Route exact path='/Dashboard/Profile' component={DashboardProfile} />
                </Content>
                
            </Layout>
        </Router>


        </Content>
        <Footer style={{ textAlign: 'center' }}>LYFE ©2021</Footer>
    </Layout>
    );
  }


export default DashboardPage; 