import React, { Component } from 'react';
import { Table, Button, Tag, Space, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, CarryOutOutlined } from '@ant-design/icons';
import TasksForm from './TasksForm';
import TagForm from './TagForm';
import { retrieveToken } from '../tokenStorage';
import { buildPath } from './bp';
import axios from 'axios';
import moment from 'moment';
import 'antd/dist/antd.css';

class TasksTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      tags: [],
      tagName: '',
      tagColor: '',
    };
    this.tasksForm = React.createRef();
  }

  componentDidMount() {
    this.getTasks();
    this.getTags();
  }

  getTasks = () => {
    axios
      .get(buildPath('api/reminders/'), {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ tasks: res.data, prettyDate: res.data.startDate});
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  getTags = () => {
    axios
      .get(buildPath('api/reminder-types/'), {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ tags: res.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  createTag = (name) => {
    const presets = [
      '#f44336',
      '#e91e63',
      '#9c27b0',
      '#673ab7',
      '#3f51b5',
      '#2196f3',
      '#03a9f4',
      '#00bcd4',
      '#009688',
      '#4caf50',
      '#8bc34a',
      '#cddc39',
      '#ffeb3b',
      '#ffc107',
      '#ff9800',
      '#ff5722',
      '#795548',
      '#607d8b',
    ];
    const randomPick = Math.floor(Math.random() * (presets.length - 1 + 1));
    const newTag = {
      type: name,
      color: presets[randomPick],
    };

    axios
      .post(buildPath(`api/reminder-types`), newTag, {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ tags: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updateTag = (id, updatedTag) => {
    axios
      .put(buildPath(`api/reminder-types/${id}`), updatedTag, {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ tags: res.data });
        this.getTasks();
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  deleteTag = (id) => {
    axios
      .delete(buildPath(`api/reminder-types/${id}`), {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ tags: res.data });
        this.getTasks();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updateTasks = (tasks) => {
    this.setState({ tasks: tasks });
  };

  handleAdd = () => {
    this.tasksForm.current.showDrawer('add');
  };

  handleEdit = (task) => {
    this.tasksForm.current.showDrawer('edit', task);
  };

  columns = [
    {
      title: 'Tasks',
      dataIndex: 'name',
    },
    {
      title: 'Date',
      dataIndex: 'startDate',
      defaultSortOrder: 'ascend',
      sorter: (a, b) =>
        moment(a.startDate).format('x') - moment(b.startDate).format('x'),
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (date) => (
        <Tooltip
          placement="top"
          title={moment(date).format('MM-DD-YYYY, h:mm:ss a')}
        >
          <span>{moment(date).calendar()}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'type',
      render: (tagType) => {
        if (tagType) {
          const { _id, type, color } = tagType;
          return (
            <Tag color={color} key={_id}>
              {type.toUpperCase()}
              <TagForm
                id={_id}
                type={type}
                color={color}
                updateTag={this.updateTag}
                deleteTag={this.deleteTag}
              />
            </Tag>
          );
        }
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
        <TasksForm
          ref={this.tasksForm}
          tags={this.state.tags}
          updateTasks={this.updateTasks}
          createTag={this.createTag}
        />
      </div>
    );
  }
}

export default TasksTable;
