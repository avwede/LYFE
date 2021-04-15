import React, { Component } from "react";
import 'antd/dist/antd.css';
import { UserOutlined, LaptopOutlined, HomeOutlined, MedicineBoxOutlined, PlusOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom';
import { Space, Layout, Menu, Breadcrumb, Tooltip, Progress, Button, Card, Row, Col, Drawer, Form, Input, Select, DatePicker } from 'antd';

import WaterCount from "../components/WaterCount";
import ExerciseCount from "../components/ExerciseCount";
import TasksTable from "../components/TasksTable";
import ProgressBar from "../components/ProgressBar";
import Classes from "../components/Classes";

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

class DashboardHome extends React.Component {
    render () {
        return (

            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <div className="site-card-wrapper">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                        <Card title="Progress Bar" bordered={false}>
                            <ProgressBar />
                        </Card>
                        </Col>
                    </Row>
                    
                    <Row gutter={[16, 16]} >
                    <Col span={16}>
                        <Card title="Daily Tasks" bordered={false}>
                            <TasksTable />
                        </Card>
                    </Col>
                    <Col span={8} >
                        <Card title="Health" bordered={false}>
                            <WaterCount />
                            <ExerciseCount />
                        </Card>
                    </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Classes /> 
                        </Col>
                    </Row>
                </div>
            </Content>

           
        )
    }
}   

export default DashboardHome;
