import React, { Component } from 'react';
import { Button, Row, Col, Drawer, Form, Input, Select } from 'antd';
import { retrieveToken } from '../tokenStorage';
import axios from 'axios';

const { Option } = Select;

class ClassesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      action: '',
      visible: false,
      courseId: '',
      courseCode: '',
      professor: '',
      locationType: '',
      location: '',
    };
  }

  addCourse = () => {
    const newCourse = {
      courseCode: this.state.courseCode,
      professor: this.state.professor,
      location: {
        type: this.state.locationType,
        location: this.state.location,
      },
    };

    axios
      .post('http://localhost:3001/api/courses', newCourse, {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.props.updateCourses(res.data);
        this.closeDrawer();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  editCourse = () => {
    const updatedCourse = {
      courseCode: this.state.courseCode,
      professor: this.state.professor,
      location: {
        type: this.state.locationType,
        location: this.state.location,
      },
    };

    axios
      .put(
        `http://localhost:3001/api/courses/${this.state.courseId}`,
        updatedCourse,
        {
          headers: {
            Authorization: `Bearer ${retrieveToken()}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        this.props.updateCourses(res.data);
        this.closeDrawer();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleDropdownChange = (value) => {
    this.setState({ locationType: value });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  showDrawer = (action, course) => {
    if (action === 'add') this.setupAddForm();

    if (action === 'edit') this.setupEditForm(course);
  };

  closeDrawer = () => {
    this.setState({
      visible: false,
    });
  };

  setupEditForm = (course) => {
    this.setState({
      action: 'edit',
      visible: true,
      courseId: course._id,
      courseCode: course.courseCode,
      professor: course.professor,
      locationType: course.location.type,
      location: course.location.location,
    });
  };

  setupAddForm = () => {
    this.setState({
      action: 'add',
      visible: true,
      courseId: '',
      courseCode: '',
      professor: '',
      locationType: '',
      location: '',
    });
  };

  render() {
    return (
      <>
        <div className="site-form-in-drawer-wrapper">
          <Drawer
            title={
              this.state.action === 'add' ? 'Add a new class' : 'Edit a class'
            }
            width={720}
            onClose={this.closeDrawer}
            visible={this.state.visible}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
              <div
                style={{
                  textAlign: 'right',
                }}
              >
                <Button onClick={this.closeDrawer} style={{ marginRight: 8 }}>
                  Cancel
                </Button>
                <Button
                  onClick={
                    this.state.action === 'add'
                      ? this.addCourse
                      : this.editCourse
                  }
                  type="primary"
                >
                  Submit
                </Button>
              </div>
            }
          >
            <Form
              layout="vertical"
              hideRequiredMark
              ref={this.formRef}
              name="control-ref"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    id="courseCode"
                    label="Course Code"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the course code',
                      },
                    ]}
                  >
                    <Input
                      onChange={this.handleInputChange}
                      placeholder="Ex. COP 4331"
                      value={this.state.courseCode}
                      name="courseCode"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    id="professor"
                    label="Professor"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the course code',
                      },
                    ]}
                  >
                    <Input
                      onChange={this.handleInputChange}
                      placeholder="Ex. Professor Szumlanski"
                      value={this.state.professor}
                      name="professor"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    id="type"
                    label="Location Type"
                    rules={[
                      {
                        required: true,
                        message: 'Please choose the location type',
                      },
                    ]}
                  >
                    <Select
                      onSelect={this.handleDropdownChange}
                      placeholder="Ex. Zoom Link"
                      value={this.state.locationType}
                      name="type"
                    >
                      <Option value="Zoom Link">Zoom Link</Option>
                      <Option value="Classroom Location">
                        Classroom Location
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    id="location"
                    label="Link/Classroom"
                    rules={[
                      { required: true, message: 'Please enter the location' },
                    ]}
                  >
                    <Input
                      onChange={this.handleInputChange}
                      placeholder="Ex. https://ucf.zoom.us/j/91549966557"
                      value={this.state.location}
                      name="location"
                    />
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

export default ClassesForm;
