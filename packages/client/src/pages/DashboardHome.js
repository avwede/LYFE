import React from "react";
import 'antd/dist/antd.css';
import { Layout, Card, Row, Col, Carousel  } from 'antd';

import WaterCount from "../components/WaterCount";
import ExerciseCount from "../components/ExerciseCount";
import TasksTable from "../components/TasksTable";
import ProgressBar from "../components/ProgressBar";
import ClassesHome from "../components/ClassesHome";

const { Content } = Layout;

const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: 'linear-gradient(to right, #ACC1FF, #9CECFF)',
  };


class DashboardHome extends React.Component {
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
                                <h3 style={contentStyle}>"How can mirrors be real if our eyes aren't real?"" - Jaden Smith</h3>
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
                    <Col span={16}>
                        <Card title="Tasks" bordered={false} style={{paddingBottom:'15px'}}>
                            <TasksTable />
                        </Card>
                    </Col>
                    <Col span={8} >
                        <Card title="Health Tracker" bordered={false}>
                            <WaterCount />
                            <ExerciseCount />
                        </Card>
                    </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <ClassesHome /> 
                        </Col>
                    </Row>
                </div>
            </Content>

           
        )
    }
}   

export default DashboardHome;
