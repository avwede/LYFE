import React, { Component, useState } from "react";
import 'antd/dist/antd.css';
import { UserOutlined, LaptopOutlined, HomeOutlined, MedicineBoxOutlined, PlusOutlined } from '@ant-design/icons';
import { Table, Tag, Tooltip, Progress, Button, Card, Row, Col, Carousel, List, Statistic, Layout, Menu, TimePicker, DatePicker, Drawer, Form, Input, Select } from 'antd';
import ReactDOM from 'react-dom';
import classesPic from '../classes.png';
import moment from 'moment';
import axios from 'axios';

const storage = require('../tokenStorage.js');
const token = storage.retrieveToken();

class ClassesSchool extends React.Component{
    constructor(props) {
        super(props);
        this.state = { 
            courses: [],
        };
    }


    componentDidMount() {
        axios.get('http://localhost:3001/api/courses/addCourse', {headers: {'Authorization' : `Bearer ${token}`, 'Content-Type': 'application/json'} })
            .then(res => {
                this.setState({ courses: res.data });

            })
            .catch(function (error) {
                console.log(error);
            })
    }
    render(){
        return (
            <>
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

                <Row gutter={[16, 16]}>
                    <ClassesForm />
                </Row>
            </>
        )
    }
    
}

export default ClassesSchool;

const { Option } = Select;

class ClassesForm extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = { 
        visible: false, 
        courseCode: '',
        professor: '',
        
        locationType: '',
        location: ''
    };
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  /**
   * {
    "courseCode": "COP4520",
    "professor": "Dechev",
    "start": "4-21-2021 15:30",
    "end": "5-4-2021 15:30",
    "location": {
        "type": "Link",
        "location": "zoom link"
    }
}
   */

  onSubmit = () => {
      const courseObj = {courseCode: this.state.courseCode, professor: this.state.professor, type: this.state.locationType, location: this.state.location};
    //   axios.post('http://localhost:3001/api/courses/addCourse', {headers: {'Authorization' : `Bearer ${token}`, 'Content-Type': 'application/json'} }, courseObj)
    //   .then((res) => {
    //     console.log(res.data)
    // }).catch((error) => {
    //     console.log(error)
    // });
  }

  onHandleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <>
      <div className='site-form-in-drawer-wrapper'>

        <Button type="primary" onClick={this.showDrawer} >
          <PlusOutlined /> New Class
        </Button>

        <Drawer
          title="Add a new class"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.onClose, this.onSubmit} type="primary">
                Submit
              </Button>
            </div>
          }
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>

                    <Form.Item
                      name="Course Code"
                      label="Course Code"
                      rules={[{ required: true, message: 'Please enter the course code' }]}
                    >
                      <Input onChange={this.onHandleInputChange} placeholder="Ex. COP 4331" value={this.state.courseCode} name="courseCode" />
                    </Form.Item>

              </Col>
              <Col span={12}>

                  <Form.Item
                      name="Professor"
                      label="Professor"
                      rules={[{ required: true, message: 'Please enter the course code' }]}
                    >
                      <Input placeholder="Ex. Professor Szumlanski" value={this.state.courseInfo.professor} name="professor"/>
                    </Form.Item>

              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>

                    <Form.Item
                      name="Location"
                      label="Location"
                      rules={[{ required: true, message: 'Please choose the location type' }]}
                    >
                      <Select placeholder="Ex. Zoom Link" value={this.state.courseInfo.locationType} name="type">
                        <Option value="Zoom Link">Zoom Link</Option>
                        <Option value="Classroom Location">Classroom Location</Option>
                      </Select>
                    </Form.Item>

              </Col>
            
            <Col span={12}>

                    <Form.Item
                        name="Link/Location"
                        label="Link/Location"
                        rules={[{ required: true, message: 'Please enter the location' }]}
                    >
                       <Input placeholder="Ex. https://ucf.zoom.us/j/91549966557" value={this.state.courseInfo.location} name="location"/> 
                    </Form.Item>

            </Col>
            </Row>
          </Form>
        </Drawer>
        </div>
      </>
    );
  }
}
