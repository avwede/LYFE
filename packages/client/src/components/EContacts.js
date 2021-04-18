import { Table, Button } from 'antd';
import ReactDOM from 'react-dom';
import React, { Component } from "react";
import { UserOutlined, LaptopOutlined, HomeOutlined, MedicineBoxOutlined, PlusOutlined } from '@ant-design/icons';
import { Layout, Menu, Breadcrumb, Tooltip, Progress, Card, Row, Col, Drawer, Form, Input, Select, DatePicker} from 'antd';

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
for (let i = 0; i < 3; i++) {
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
          <EContactsForm/>
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

class EContactsForm extends React.Component {
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
          <PlusOutlined /> New emergency contact
        </Button>

        <Drawer
          title="Add a new emergency contact"
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
              <Col span={24}>
                <Form.Item
                  name="Name"
                  label="Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the name',
                    },
                  ]}
                >
                  <Input.TextArea rows={1} placeholder="Ex. John Smith" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="PhoneNumber"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Please enter the phone number' }]}
                >
                  <Input placeholder="Ex. 123-456-7891" />
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                  name="EmailAddress"
                  label="Email Address"
                  rules={[{ required: true, message: 'Please enter the email address' }]}
                >
                  <Input placeholder="Ex. myFriend123@gmail.com" />
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