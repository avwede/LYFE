import { Table, Button } from 'antd';
import ReactDOM from 'react-dom';
import React, { Component } from "react";

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Phone Number',
    dataIndex: 'phonenumber',
  },
  {
    title: 'Email Address',
    dataIndex: 'emailaddress',
  },
];

const data = [];
for (let i = 0; i < 5; i++) {
  data.push({
    key: i,
    name: `dababy ${i}`,
    phonenumber: '123-456-7890',
    emailaddress: `letsgooooo@gmail.com`,
  });
}

class EContacts extends React.Component {
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
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
            </span>
          </div>
          <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
        </div>
      );
    }
  }
  
export default EContacts;