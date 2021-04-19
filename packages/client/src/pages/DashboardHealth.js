import React from "react";
import 'antd/dist/antd.css';
import { Layout, Card, Row, Col } from 'antd';

import '../components/components.css';
import EContacts from "../components/EContacts";
import AppointmentsTable from "../components/AppointmentsTable";
import AllergiesCards from "../components/AllergiesCards";


const { Content } = Layout;

class DashboardHealth extends React.Component {
    render () {
      return (
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <div className="site-card-wrapper">

              <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card title="Appointments" bordered={false} >
                        <AppointmentsTable />
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
