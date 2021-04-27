import { Button } from 'antd';
import React, { Component } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Row, Col, Drawer, Form, Input, Select, Divider } from 'antd';
import { retrieveToken } from '../tokenStorage';
import { buildPath } from './bp';
import axios from 'axios';
import 'antd/dist/antd.css';

const { Option } = Select;

class TasksForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      action: '',
      taskId: '',
      name: '',
      startDate: '',
      description: '',
      type: '',
      taskTypes: [],
    };
    this.index = 0;
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

  addTask = () => {
    const newTask = {
      name: this.state.name,
      startDate: this.state.startDate,
      description: this.state.description,
    };

    axios
      .post(buildPath('api/reminders/'), newTask, {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.props.updateTasks(res.data);
        this.closeDrawer();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  editTask = () => {
    const updatedTask = {
      name: this.state.name,
      startDate: this.state.startDate,
      description: this.state.description,
    };

    axios
      .put(buildPath(`api/reminders/${this.state.taskId}`), updatedTask, {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.props.updateTasks(res.data);
        this.closeDrawer();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleDropdownChange = (value) => {
    this.setState({ description: value });
  };

  showDrawer = (action, task) => {
    if (action === 'add') this.setupAddForm();

    if (action === 'edit') this.setupEditForm(task);
  };

  closeDrawer = () => {
    this.setState({
      visible: false,
    });
  };

  setupEditForm = (task) => {
    this.setState({
      action: 'edit',
      visible: true,
      taskId: task._id,
      name: task.name,
      startDate: task.startDate,
      description: task.description,
    });
  };

  setupAddForm = () => {
    this.setState({
      action: 'add',
      visible: true,
      name: '',
      startDate: '',
      description: '',
    });
  };

  render() {
    return (
      <>
        <div className="site-form-in-drawer-wrapper">
          <Drawer
            title={
              this.state.action === 'add' ? 'Add a new task' : 'Edit a task'
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
                    this.state.action === 'add' ? this.addTask : this.editTask
                  }
                  type="primary"
                >
                  Submit
                </Button>
              </div>
            }
          >
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    id="name"
                    label="Task"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter task',
                      },
                    ]}
                  >
                    <Input
                      onChange={this.handleInputChange}
                      placeholder="Ex. Do COP 4331 discussion post"
                      value={this.state.name}
                      name="name"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    id="startDate"
                    label="Date"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the date',
                      },
                    ]}
                  >
                    <Input
                      onChange={this.handleInputChange}
                      placeholder="Ex. 11/11/11"
                      value={this.state.startDate}
                      //{this.formatDateString()}
                      name="startDate"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>

                  {/* <Form.Item
                    id="description"
                    label="Tags"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the appropriate tags',
                      },
                    ]}
                  >
                    <Select
                      onSelect={this.handleDropdownChange}
                      placeholder="Ex. School"
                      value={this.state.description}
                      name="description"
                    >
                      <Option value="School">School</Option>
                      <Option value="Appointments">Appointments</Option>
                      <Option value="Medication">Medication</Option>
                      <Option value="Exercise">Exercise</Option>
                      <Option value="Other">Other</Option>
                    </Select>
                  </Form.Item> */}
                </Col>
              </Row>
            </Form>
          </Drawer>
        </div>
      </>
    );
  }
}

export default TasksForm;