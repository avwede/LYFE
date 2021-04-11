import ReactDOM from 'react-dom';
import { Table, Button, Tag, Space } from 'antd';
import React, { Component, useState } from "react";
import 'antd/dist/antd.css';

function TasksTable(){
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
  ];


  return (
      <Table columns={columns} dataSource={data} pagination={false} />
  );
}
// ReactDOM.render(<Table columns={columns} dataSource={data} />, mountNode);

export default TasksTable;
/*

const columns = [
  {
    title: 'Task',
    dataIndex: 'task',
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    render: tags => (
      <span>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  },
  {
    title: 'Date',
    dataIndex: 'date',
  },
];

const data = [];
for (let i = 0; i < 20; i++) {
  data.push({
    key: i,
    task: `homework ${i}`,
    age: 32,
    date: `4/7/2021 ${i}`,
  });
}

class TasksTable extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  };

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
            Reload
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} tasks` : ''}
          </span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      </div>
    );
  }
}

ReactDOM.render(<TasksTable/>, document.getElementById('root'));

export default TasksTable;*/