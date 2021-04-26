import React from "react";
import { UsergroupAddOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Space, Layout, Menu, Breadcrumb, Tooltip, Progress, Card, Row, Col, Drawer, Form, Input, Select, DatePicker, Table, Button} from 'antd';
import axios from 'axios';
import { retrieveToken } from '../tokenStorage';
import { buildPath } from './bp'


class EContacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
    };
    this.contactsForm = React.createRef();
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
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteContact = (id) => {
    axios
      .delete(buildPath(`api/contacts/${id}`), {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ contacts: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
    },
    {
      title: 'Relation',
      dataIndex: 'relation',
    },
    {
      title: '',
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined
              key="edit"
              onClick={() => this.handleEdit(record)}
          />
          <DeleteOutlined
              key="delete"
              onClick={() => this.deleteContact(record._id)}
          />
        </Space>
      ),
    },
  ];

  updateContacts = (contacts) => {
    this.setState({ contacts: contacts });
  };

  handleAdd = () => {
    this.contactsForm.current.showDrawer('add');
  };

  handleEdit = (contact) => {
    this.contactsForm.current.showDrawer('edit', contact);
  };
  
    render() {
      return (
        <div>
          <Table columns={this.columns} dataSource={this.state.contacts} pagination={{defaultPageSize: 5}} />

          <Button type="primary" onClick={this.handleAdd}>
            <UsergroupAddOutlined /> New emergency contact
          </Button>

          <EContactsForm
          ref={this.contactsForm}
          updateContacts={this.updateContacts}
        />
        </div>
      );
    }
  }
  
export default EContacts;

class EContactsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      visible: false,
      action: '',
      contactId: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      relation: '',
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

  addContact = () => {
    const newContact = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      phoneNumber: this.state.phoneNumber,
      relation: this.state.relation
    };

    axios
      .post(buildPath('api/contacts/'), newContact, {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.props.updateContacts(res.data);
        this.closeDrawer();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  editContact = () => {
    const updatedContact = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      phoneNumber: this.state.phoneNumber,
      relation: this.state.relation
    };

    axios
      .put(
        buildPath(`api/contacts/${this.state.contactId}`),
        updatedContact,
        {
          headers: {
            Authorization: `Bearer ${retrieveToken()}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        this.props.updateContacts(res.data);
        this.closeDrawer();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  showDrawer = (action, contact) => {
    if (action === 'add') this.setupAddForm();

    if (action === 'edit') this.setupEditForm(contact);
  };

  closeDrawer = () => {
    this.setState({
      visible: false,
    });
  };

  setupEditForm = (contact) => {
    this.setState({
      action: 'edit',
      visible: true,
      contactId: contact._id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      relation: contact.relation,
    });
  };

  setupAddForm = () => {
    this.setState({
      action: 'add',
      visible: true,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      relation: '',
    });
  };

  render() {
    return (
      <>
      <div className='site-form-in-drawer-wrapper'>

        <Drawer
            title={
              this.state.action === 'add' ? 'Add a new emergency contact' : 'Edit an emergency contact'
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
                    this.state.action === 'add'
                      ? this.addContact
                      : this.editContact
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
              <Col span={12}>
                <Form.Item
                  id="firstName"
                  label="First Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter first name',
                    },
                  ]}
                >
                  <Input 
                    onChange={this.handleInputChange}
                    placeholder="Ex. John"
                    value={this.state.firstName}
                    name="firstName" />
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                  id="lastName"
                  label="Last Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter last name',
                    },
                  ]}
                >
                  <Input 
                    onChange={this.handleInputChange}
                    placeholder="Ex. Doe"
                    value={this.state.lastName}
                    name="lastName"  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  id="phoneNumber"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Please enter the phone number' }]}
                >
                  <Input 
                    onChange={this.handleInputChange}
                    placeholder="Ex. 123-456-7891"
                    value={this.state.phoneNumber}
                    name="phoneNumber" />
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                  id="email"
                  label="Email Address"
                  rules={[{ required: true, message: 'Please enter the email address' }]}
                >
                  <Input
                   onChange={this.handleInputChange}
                   placeholder="Ex. johndoe@gmail.com"
                   value={this.state.email}
                   name="email" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  id="relation"
                  label="Relation"
                  rules={[{ required: true, message: 'Please enter relationship' }]}
                >
                  <Input  
                    onChange={this.handleInputChange}
                    placeholder="Ex. Father"
                    value={this.state.relation}
                    name="relation" />
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