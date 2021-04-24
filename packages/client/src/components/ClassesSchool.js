import React, { Component, useState } from "react";
import 'antd/dist/antd.css';
import { UserOutlined, LaptopOutlined, HomeOutlined, MedicineBoxOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Tag, Tooltip, Progress, Button, Card, Row, Col, Carousel, List, Statistic, Layout, Menu, TimePicker, DatePicker, Drawer, Form, Input, Select } from 'antd';
import ReactDOM from 'react-dom';
import classesPic from '../classes.png';
import ClassesForm from './ClassesForm';
import axios from 'axios';
import 'antd/dist/antd.css';

const storage = require('../tokenStorage.js');
const token = storage.retrieveToken();
console.log(token);
const bp = require('./bp.js');
var currentId;

class ClassesSchool extends React.Component{
    constructor(props) {
        super(props);
        this.state = { 
            courses: [],
        };
    }


    componentDidMount() {
        axios.get('http://localhost:3001/api/courses/', {headers: {'Authorization' : `Bearer ${token}`, 'Content-Type': 'application/json'} })
            .then(res => {
                this.setState({ courses: res.data });
                console.log(this.state.courses);
            })
            .catch(function (error) {
                console.log(error);
            })
      }

      doDelete(id) {
        axios
          .delete(`http://localhost:3001/api/courses/deleteCourse/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
          .then((res) => {
            this.setState({ courses: res.data });
          })
          .catch((error) => {
            console.log(error);
          });
      }

      doEdit(id) {
        console.log('from doEdit');
        currentId = id;
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
                  {this.state.courses.map((course) => {
                      return (                         
                        <Col span={8}>
                          
                            <Card key={course._id} title={course.courseCode} style={{marginBottom: '25px'}} headStyle={{backgroundColor: '#DBF3FA'}} bordered={true} actions={[
                              <EditOutlined key="edit" onClick={(event) => this.doEdit(course._id)}/>,
                              <DeleteOutlined key="delete" onClick={(event) => this.doDelete(course._id)}/>,
                            ]}>
                                
                                {course.location.type == 'Zoom Link' ? (
                                  <p><a href={course.location.location}>
                                    Zoom Meeting Link
                                  </a></p>
                                ) : (
                                  <p>Classroom Building: {course.location.location}</p>
                                )}

                                <p>{course.professor}</p> 
                            </Card>
            
                        </Col>
                      );
                    })}
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

// ----------------------------------------------------EDIT FORM-----------------------------------------------------------------------
class ClassesEditForm extends React.Component {
    
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

  onSubmit = (id) => {
      const courseObj = {courseCode: this.state.courseCode, professor: this.state.professor, location: { type: this.state.locationType, location: this.state.location} };
      console.log(courseObj);
      axios.post(`http://localhost:3001/api/courses/editCourse${id}`, courseObj, {headers: {'Authorization' : `Bearer ${token}`, 'Content-Type': 'application/json'} })
      .then((res) => {
        console.log(res.data)
    }).catch((error) => {
        console.log(error)
    });
    this.onClose();
    //bp.buildPath('api/courses/addCourse')
  }

  onHandleDropdownChange = (event, result) => {
    this.setState({ locationType: event});
    //console.log('event:', event);
    //console.log('result:', result );
  }

  onHandleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <>
      <div className='site-form-in-drawer-wrapper'>

      <Button type="primary" onClick={this.showDrawer} >
          <PlusOutlined /> edit Class
        </Button>
         
        <Drawer
          title="Edit a class"
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
              <Button onClick={this.onSubmit} type="primary">
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
                      <Input onChange={this.onHandleInputChange} placeholder="Ex. Professor Szumlanski" value={this.state.professor} name="professor"/>
                    </Form.Item>

              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>

                    <Form.Item
                      name="Location Type"
                      label="Location Type"
                      rules={[{ required: true, message: 'Please choose the location type' }]}
                    >
                      <Select onSelect={this.onHandleDropdownChange} placeholder="Ex. Zoom Link" value={this.state.locationType} name="type">
                        <Option value="Zoom Link">Zoom Link</Option>
                        <Option value="Classroom Location">Classroom Location</Option>
                      </Select>
                    </Form.Item>

              </Col>
            
            <Col span={12}>

                    <Form.Item
                        name="Link/Classroom"
                        label="Link/Classroom"
                        rules={[{ required: true, message: 'Please enter the location' }]}
                    >
                       <Input onChange={this.onHandleInputChange} placeholder="Ex. https://ucf.zoom.us/j/91549966557" value={this.state.location} name="location"/> 
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

// ----------------------------------------------------ADD FORM-----------------------------------------------------------------------
class ClassesForm extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
    };
    this.classesForm = React.createRef();
  }

  componentDidMount() {
    axios
      .get(buildPath('api/courses/'), {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ courses: res.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteCourse = (id) => {
    axios
      .delete(buildPath(`api/courses/${id}`), {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ courses: res.data });
      })
      .catch((error) => {
        console.log(error);
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
      const courseObj = {courseCode: this.state.courseCode, professor: this.state.professor, location: { type: this.state.locationType, location: this.state.location} };
      console.log(courseObj);
      axios.post('http://localhost:3001/api/courses/addCourse', courseObj, {headers: {'Authorization' : `Bearer ${token}`, 'Content-Type': 'application/json'} })
      .then((res) => {
        console.log(res.data)
    }).catch((error) => {
        console.log(error)
    });
    this.onClose();
    //bp.buildPath('api/courses/addCourse')
  }

  onHandleDropdownChange = (event, result) => {
    this.setState({ locationType: event});
  }

  handleEdit = (course) => {
    this.classesForm.current.showDrawer('edit', course);
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
              <Button onClick={this.onSubmit} type="primary">
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
                      <Input onChange={this.onHandleInputChange} placeholder="Ex. Professor Szumlanski" value={this.state.professor} name="professor"/>
                    </Form.Item>

              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>

                    <Form.Item
                      name="Location Type"
                      label="Location Type"
                      rules={[{ required: true, message: 'Please choose the location type' }]}
                    >
                      <Select onSelect={this.onHandleDropdownChange} placeholder="Ex. Zoom Link" value={this.state.locationType} name="type">
                        <Option value="Zoom Link">Zoom Link</Option>
                        <Option value="Classroom Location">Classroom Location</Option>
                      </Select>
                    </Form.Item>

              </Col>
            
            <Col span={12}>

                    <Form.Item
                        name="Link/Classroom"
                        label="Link/Classroom"
                        rules={[{ required: true, message: 'Please enter the location' }]}
                    >
                       <Input onChange={this.onHandleInputChange} placeholder="Ex. https://ucf.zoom.us/j/91549966557" value={this.state.location} name="location"/> 
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

export default ClassesSchool;
