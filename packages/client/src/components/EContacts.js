import { Table, Button } from 'antd';
import ReactDOM from 'react-dom';
import React, { Component } from "react";
import { UserOutlined, LaptopOutlined, HomeOutlined, MedicineBoxOutlined, PlusOutlined } from '@ant-design/icons';
import { Layout, Menu, Breadcrumb, Tooltip, Progress, Card, Row, Col, Drawer, Form, Input, Select, DatePicker} from 'antd';
import axios from 'axios';
import { retrieveToken } from '../tokenStorage';
import { buildPath } from './bp'

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
  {
    title: 'Actions',
    dataIndex: 'actions',
  },
];

const data = [];
// for (let i = 0; i < 3; i++) {
//   data.push({
//     key: i,
//     name: `dababy ${i}`,
//     phonenumber: '123-456-7890',
//     emailaddress: `letsgooooo@gmail.com`,
//   });
// }

class EContacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
    };
  }

  componentDidMount() {
    axios
      .get(buildPath('api/contacts/'), {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ contacts: res.data });
        this.state.contacts.map((contacts) => {
          return(
            data.push({
                  key: contacts._id,
                  name: contacts.firstName,
                  phonenumber: contacts.phonenumber,
                  emailaddress: contacts.email,
                })
          )
        })
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
    render() {
      return (
        <div>
          <EContactsForm/>
          <Table columns={columns} dataSource={data} pagination={{defaultPageSize: 5}} />
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
              <Col span={12}>
                <Form.Item
                  name="FirstName"
                  label="First Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter first name',
                    },
                  ]}
                >
                  <Input.TextArea rows={1} placeholder="Ex. John" />
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                  name="LastName"
                  label="Last Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter last name',
                    },
                  ]}
                >
                  <Input placeholder="Ex. Smith" />
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
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="Relation"
                  label="Relation"
                  rules={[{ required: true, message: 'Please enter relationship' }]}
                >
                  <Input placeholder="Ex. Mother" />
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