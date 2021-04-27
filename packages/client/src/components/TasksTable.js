import React, { Component } from 'react';
import { Table, Button, Tag, Space } from 'antd';
import { DeleteOutlined, EditOutlined, CarryOutOutlined } from '@ant-design/icons';
import { retrieveToken } from '../tokenStorage';
import { buildPath } from './bp';
import TasksForm from './TasksForm';
import axios from 'axios';
import 'antd/dist/antd.css';

class TasksTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
    };
    this.tasksForm = React.createRef();
  }

  formatDateString = () => {
    const dateCheck = new Date(this.state.health.dateOfBirth);

    return `${
      dateCheck.getMonth() + 1
    }/${dateCheck.getDate()}/${dateCheck.getFullYear()}`;
  };

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

  deleteTask = (id) => {
    axios
      .delete(buildPath(`api/reminders/${id}`), {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ tasks: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  columns = [
    {
      title: 'Tasks',
      dataIndex: 'name',
    },
    {
      title: 'Date',
      dataIndex: 'startDate',
    },
    {
      title: 'Tags',
      dataIndex: 'type',
      render: (tagType) => {
        const { _id, type, color } = tagType;
        return (
          <Tag color={color} key={_id}>
            {type.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: '',
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined key="edit" onClick={() => this.handleEdit(record)} />
          <DeleteOutlined
            key="delete"
            onClick={() => this.deleteTask(record._id)}
          />
        </Space>
      ),
    },
  ];

  updateTasks = (tasks) => {
    this.setState({ tasks: tasks });
  };

  handleAdd = () => {
    this.tasksForm.current.showDrawer('add');
  };

  handleEdit = (task) => {
    this.tasksForm.current.showDrawer('edit', task);
  };

  render() {
    return (
      <div>
        <Table
          columns={this.columns}
          dataSource={this.state.tasks}
          pagination={{ defaultPageSize: 5 }}
        />

        <Button type="primary" onClick={this.handleAdd}>
          <CarryOutOutlined /> New Task
        </Button>

        <TasksForm ref={this.tasksForm} updateTasks={this.updateTasks} />
      </div>
    );
  }
}

export default TasksTable;
