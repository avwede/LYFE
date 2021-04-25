import ReactDOM from 'react-dom';
import { Table, Button, Tag, Space, Pagination, InputNumber, Popconfirm, Typography  } from 'antd';
import React, { Component, useState } from "react";
import 'antd/dist/antd.css';
import { UserOutlined, LaptopOutlined, HomeOutlined, MedicineBoxOutlined, PlusOutlined } from '@ant-design/icons';
import { Layout, Menu, Breadcrumb, Tooltip, Progress, Card, Row, Col, Drawer, Form, Input, Select, DatePicker} from 'antd';
import { retrieveToken } from '../tokenStorage';
import { buildPath } from './bp'
import axios from 'axios';

const api = axios.create({
  baseURL : 'http://localhost:3000/api/reminders'
})



/*
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

class TasksTable extends React.Component {
  
  render () {
    return (
      <>
        <TasksForm/>
        <Table columns={columns} dataSource={data} pagination={{defaultPageSize: 5}} />
      </>
    );

  }
  
}
*/

class TasksTable extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
    };
  }

  componentDidMount() {
    axios
      .get(buildPath('api/reminders/'), {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ tasks: res.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render(){
    return(
      <>
        {this.state.tasks.map((tasks) => {
          return(
            originData.push({
                  key: '1',
                  Task: tasks.name,
                  Date: '11/11/11',
                  Tag: 'School',
                })
          )
        })}
        <EditableTable />
        <TasksForm />
      </>
    )
  }
    
}

export default TasksTable; 

  var originData = [];
  const otherData = [];

  for (let i = 0; i < 1; i++) {
    originData.push({
      key: i.toString(),
      Task: `Homework ${i}`,
      Date: '11/11/11',
      Tag: 'School',
    });
  }

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const EditableTable = () => {
    const [form] = Form.useForm();
    console.log(form);
    console.log(originData);
    console.log(otherData);
    const [data, setData] = useState(originData);
    console.log(data);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
      form.setFieldsValue({
        name: '',
        age: '',
        address: '',
        ...record,
      });
      setEditingKey(record.key);
    };

    const cancel = () => {
      setEditingKey('');
    };

    const save = async (key) => {
      try {
        const row = await form.validateFields();
        const newData = [...data];
        const index = newData.findIndex((item) => key === item.key);

        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, { ...item, ...row });
          setData(newData);
          setEditingKey('');
        } else {
          newData.push(row);
          setData(newData);
          setEditingKey('');
        }
      } catch (errInfo) {
        console.log('Validate Failed:', errInfo);
      }
    };

    const columns = [
      {
        title: 'Task',
        dataIndex: 'Task',
        width: '25%',
        editable: true,
      },
      {
        title: 'Date',
        dataIndex: 'Date',
        width: '15%',
        editable: true,
      },
      {
        title: 'Tag',
        dataIndex: 'Tag',
        width: '40%',
        editable: true,
      },
      {
        title: 'Action',
        dataIndex: 'Action',
        render: (_, record) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <a
                href="javascript:;"
                onClick={() => save(record.key)}
                style={{
                  marginRight: 8,
                }}
              >
                Save
              </a>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
          );
        },
      },
    ];
    
    const mergedColumns = columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });



    return (
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          {...console.log({data})}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
            defaultPageSize: 5,
          }}
        />
      </Form>
    );
  };


// .editable-row .ant-form-item-explain {
//   position: absolute;
//   top: 100%;
//   font-size: 12px;
// }




const options = [{ value: 'School' }, { value: 'Health' }, { value: 'Exercise' }, { value: 'Medication' }];
const { Option } = Select;

class TasksForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      task: '',
      courseCode: '',
      professor: '',
      locationType: '',
      location: '',
    };
  }

  // addTask = () => {
  //   const newTask = {
  //     courseCode: this.state.courseCode,
  //     professor: this.state.professor,
  //     location: {
  //       type: this.state.locationType,
  //       location: this.state.location,
  //     },
  //   };

  //   axios
  //     .post(buildPath('api/courses/'), newTask, {
  //       headers: {
  //         Authorization: `Bearer ${retrieveToken()}`,
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //     .then((res) => {
  //       this.props.updateCourses(res.data);
  //       this.closeDrawer();
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
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

