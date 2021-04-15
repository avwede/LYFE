import ReactDOM from 'react-dom';
import { Table, Button, Tag, Space, Pagination } from 'antd';
import React, { Component, useState } from "react";
import 'antd/dist/antd.css';
import { UserOutlined, LaptopOutlined, HomeOutlined, MedicineBoxOutlined, PlusOutlined } from '@ant-design/icons';
import { Layout, Menu, Breadcrumb, Tooltip, Progress, Card, Row, Col, Drawer, Form, Input, Select, DatePicker} from 'antd';

function TasksTable() {
  const columns = [
    {
      title: 'Task',
      dataIndex: 'task',
      key: 'task',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'School') {
              color = 'geekblue';
            }
            else if (tag == 'Health'){
              color = 'green';
            }
            else if (tag == 'Medication'){
              color = 'volcano';
            }
            else if (tag == 'Exercise'){
              color = 'purple';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      task: 'Finish essay',
      date: '10/3/21',
      tags: ['School'],
    },
    {
      key: '2',
      task: 'Take tylenol',
      date: '11/11/11',
      tags: ['Medication', 'Health'],
    },
    {
      key: '3',
      task: 'Take a walk in the arboretum',
      date: '11/11/11',
      tags: ['Exercise', 'Health'],
    },
    {
      key: '4',
      task: 'print out homework',
      date: '11/11/11',
      tags: ['School'],
    },
    {
      key: '5',
      task: 'Go to gym',
      date: '11/11/11',
      tags: ['Exercise', 'Health'],
    },
    {
      key: '6',
      task: 'Finish programming assignment',
      date: '10/3/21',
      tags: ['School'],
    },
    {
      key: '7',
      task: 'Take meds',
      date: '11/14/11',
      tags: ['Medication', 'Health'],
    },
    {
      key: '8',
      task: 'Take a bike ride',
      date: '12/27/11',
      tags: ['Exercise', 'Health'],
    },
    {
      key: '9',
      task: 'print out paper',
      date: '11/11/11',
      tags: ['School'],
    },
    {
      key: '10',
      task: 'Go to office hours',
      date: '11/11/11',
      tags: ['School'],
    },
  ];


  return (
    <>
      <TasksForm/>
     
      <Table columns={columns} dataSource={data} pagination={{defaultPageSize: 5}}/>
    </>
  );
}

export default TasksTable;

const options = [{ value: 'School' }, { value: 'Health' }, { value: 'Exercise' }, { value: 'Medication' }];
const { Option } = Select;

class TasksForm extends React.Component {
  state = { visible: false };

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

  render() {
    return (
      <>
      <div className='site-form-in-drawer-wrapper'>

        <Button type="primary" onClick={this.showDrawer}>
          <PlusOutlined /> New task
        </Button>

        <Drawer
          title="Create a new task"
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
              <Button onClick={this.onClose} type="primary">
                Submit
              </Button>
            </div>
          }
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="Task"
                  label="Task"
                  rules={[{ required: true, message: 'Please enter task' }]}
                >
                  <Input placeholder="Please enter task" />
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                  name="dateTime"
                  label="DateTime"
                  rules={[{ required: true, message: 'Please choose the dateTime' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    getPopupContainer={trigger => trigger.parentElement}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="owner"
                  label="Owner"
                  rules={[{ required: true, message: 'Please select an owner' }]}
                >
                  <Select
                      mode="multiple"
                      showArrow
                      tagRender={tagRender}
                      style={{ width: '100%' }}
                      options={options}
                    />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Type"
                  rules={[{ required: true, message: 'Please choose the type' }]}
                >
                  <Select placeholder="Please choose the type">
                    <Option value="private">Private</Option>
                    <Option value="public">Public</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="approver"
                  label="Approver"
                  rules={[{ required: true, message: 'Please choose the approver' }]}
                >
                  <Select placeholder="Please choose the approver">
                    <Option value="jack">Jack Ma</Option>
                    <Option value="tom">Tom Liu</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dateTime"
                  label="DateTime"
                  rules={[{ required: true, message: 'Please choose the dateTime' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    getPopupContainer={trigger => trigger.parentElement}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: 'please enter url description',
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="please enter url description" />
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

function tagRender(props) {
  const { label, value, closable, onClose } = props;

  return (
    <Tag color={'gold'} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
      {label}
    </Tag>
  );
}

