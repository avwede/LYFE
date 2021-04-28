import React, { Component, createRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Row, Col, Drawer, Form, Input, Select, Divider, DatePicker, Button } from 'antd';
import { retrieveToken } from '../tokenStorage';
import { buildPath } from './bp';
import axios from 'axios';
import moment from 'moment';
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
      startDateMoment: null,
      startDate: '',
      tagType: '',
      newTag: '',
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

  addTask = () => {
    const newTask = {
      name: this.state.name,
      startDate: this.state.startDate,
    };

    if (this.state.tagType !== '')
      newTask['type'] = this.state.tagType;

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
      type: this.state.tagType,
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
    this.setState({ tagType: value });
  };

  handleCreateTag = () => {
    this.props.createTag(this.state.newTag);
    this.setState({ newTag: '' });
  };

  handleDateChange = (value, dateString) => {
    this.setState({ startDateMoment: value, startDate: dateString });
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
      startDateMoment: moment(task.startDate),
      tagType: task.type ? task.type._id : '',
    });
  };

  setupAddForm = () => {
    this.setState({
      action: 'add',
      visible: true,
      name: '',
      startDate: '',
      startDateMoment: moment(),
      tagType: '',
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
                        message: 'Please enter a task',
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
                <Col span={8}>
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
                    <DatePicker
                      onChange={this.handleDateChange}
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      value={this.state.startDateMoment}
                    />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    id="tags"
                    label="Tags"
                    rules={[
                      {
                        required: true,
                        message: 'Please select a tag',
                      },
                    ]}
                  >
                    <Select
                      onSelect={this.handleDropdownChange}
                      placeholder="Select a tag."
                      value={this.state.tagType}
                      name="tags"
                      dropdownRender={(menu) => (
                        <div>
                          {menu}
                          <Divider style={{ margin: '4px 0' }} />
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'nowrap',
                              padding: 8,
                            }}
                          >
                            <Input
                              style={{ flex: 'auto' }}
                              name="newTag"
                              onChange={this.handleInputChange}
                              value={this.state.newTag}
                            />
                            <Button
                              type="link"
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                              onClick={this.handleCreateTag}
                            >
                              <PlusOutlined /> Add item
                            </Button>
                          </div>
                        </div>
                      )}
                    >
                      {this.props.tags.map((tag) => (
                        <Option key={tag._id} value={tag._id}>
                          {tag.type}
                        </Option>
                      ))}
                    </Select>
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

export default TasksForm;