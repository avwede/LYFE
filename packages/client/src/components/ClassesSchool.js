import React, { Component } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Row, Col } from 'antd';
import { retrieveToken } from '../tokenStorage';
import classesPic from '../classes.png';
import ClassesForm from './ClassesForm';
import axios from 'axios';
import 'antd/dist/antd.css';

class ClassesSchool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
    };
    this.classesForm = React.createRef();
  }

  componentDidMount() {
    axios
      .get('http://localhost:3001/api/courses/', {
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
      .delete(`http://localhost:3001/api/courses/${id}`, {
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

  updateCourses = (courses) => {
    this.setState({ courses: courses });
  };

  handleAdd = () => {
    this.classesForm.current.showDrawer('add');
  };

  handleEdit = (course) => {
    this.classesForm.current.showDrawer('edit', course);
  };

  render() {
    return (
      <>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <img
              className="Logo"
              src={classesPic}
              style={{ width: '345px', height: '220px' }}
              alt="Logo"
            />
          </Col>
          <Col span={16}>
            <div className="site-card-wrapper">
              <Row gutter={16}>
                {this.state.courses.map((course) => {
                  return (
                    <Col span={8}>
                      <Card
                        key={course._id}
                        title={course.courseCode}
                        style={{ marginBottom: '25px' }}
                        headStyle={{ backgroundColor: '#DBF3FA' }}
                        bordered={true}
                        actions={[
                          <EditOutlined
                            key="edit"
                            onClick={() => this.handleEdit(course)}
                          />,
                          <DeleteOutlined
                            key="delete"
                            onClick={() => this.deleteCourse(course._id)}
                          />,
                        ]}
                      >
                        {course.location.type === 'Zoom Link' ? (
                          <p>
                            <a href={course.location.location}>
                              Zoom Meeting Link
                            </a>
                          </p>
                        ) : (
                          <p>Building: {course.location.location}</p>
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
        <Row>
          <Button type="primary" onClick={this.handleAdd}>
            <PlusOutlined /> New Class
          </Button>
        </Row>
        <ClassesForm
          ref={this.classesForm}
          updateCourses={this.updateCourses}
        />
      </>
    );
  }
}

export default ClassesSchool;
