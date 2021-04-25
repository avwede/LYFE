import React, { Component } from "react";
import 'antd/dist/antd.css';
import { Table, } from 'antd';
import { UserOutlined, LaptopOutlined, HomeOutlined, MedicineBoxOutlined, PlusOutlined } from '@ant-design/icons';
import { Layout, Menu, Breadcrumb, Tooltip, Progress, Button, Card, Row, Col, Drawer, Form, Input, Select, DatePicker } from 'antd';
import ReactDOM from 'react-dom';
import '../components/components.css';
import EContacts from "../components/EContacts";
import HealthProfile from "../components/HealthProfile";
import AllergiesCards from "../components/AllergiesCards";

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

class DashboardHealth extends React.Component {
    render () {
      return (
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <div className="site-card-wrapper">

              <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card title="Health Profile" bordered={false} >
                        <HealthProfile />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Emergency Contacts" bordered={false}>
                        <EContacts />
                    </Card>
                  </Col>
              </Row>
                  
              <Row gutter={[16, 16]} >
                <Col span={12}>
                    <Card title="Allergies" bordered={false}>
                      <AllergiesCards />
                    </Card>
                </Col>
                <Col span={12} >
                    <Card title="Medications" bordered={false}>
                        
                    </Card>
                </Col>
              </Row>

              </div>
          </Content>
        )
    }
}   

export default DashboardHealth;
