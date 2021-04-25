import { Table, Button, Tag, Space } from 'antd';
import React from "react";
import 'antd/dist/antd.css';
import { PlusOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { Row, Col, Drawer, Form, Input, Select, DatePicker, Descriptions, Badge} from 'antd';
import { retrieveToken } from '../tokenStorage';
import { buildPath } from './bp'
import axios from 'axios';


class HealthProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      health: [],
    };
    this.healthForm = React.createRef();
  }

  componentDidMount() {
    axios
      .get(buildPath('api/health/'), {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ health: res.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteContact = (id) => {
    axios
      .delete(buildPath(`api/health/${id}`), {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ health: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updateContacts = (health) => {
    this.setState({ health: health });
  };

  handleAdd = () => {
    this.healthForm.current.showDrawer('add');
  };

  handleEdit = (health) => {
    this.healthForm.current.showDrawer('edit', health);
  };

  render(){
    return (
      <>
      {/* { this.state.health.map((profile) => {
        return (
          <Descriptions bordered style={{marginBottom: '40px'}}>
          <Descriptions.Item label="Date of Birth" labelStyle={{background: '#DBF3FA', fontWeight: 'bold'}}>{profile.dateOfBirth}</Descriptions.Item>
          <Descriptions.Item label="Height" labelStyle={{background: '#DBF3FA', fontWeight: 'bold'}}>{profile.height}</Descriptions.Item>
          <Descriptions.Item label="Weight" labelStyle={{background: '#DBF3FA', fontWeight: 'bold'}}>{profile.weight}</Descriptions.Item>
          <Descriptions.Item label="Gender" labelStyle={{background: '#DBF3FA', fontWeight: 'bold'}}>{profile.gender}</Descriptions.Item>
          <Descriptions.Item label="Blood Type" span={2} labelStyle={{background: '#DBF3FA', fontWeight: 'bold'}}>{profile.bloodType}</Descriptions.Item>
          <Descriptions.Item label="Health Conditions" span={3} labelStyle={{background: '#DBF3FA', fontWeight: 'bold'}}>High Blood Pressure</Descriptions.Item>
          </Descriptions>
        )})
      }; */}

        <HealthProfileForm />
        </>
     ) 
  }
}
  

export default HealthProfile;


const { Option } = Select;

class HealthProfileForm extends React.Component {
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

        <Button type="primary" onClick={this.showDrawer} >
          <MedicineBoxOutlined /> Create Health Profile
        </Button>

        <Drawer
          title="Create Health Profile"
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
                  id="dateOfBirth"
                  label="Date of Birth"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your date of birth',
                    },
                  ]}
                >
                  <Input placeholder="Ex. 01/01/1999" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  id="gender"
                  label="Gender"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your date of birth',
                    },
                  ]}
                >
                  <Select
                      //onSelect={this.handleDropdownChange}
                      placeholder="Ex. Male"
                      //value={this.state.description}
                      name="gender"
                    >
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                      <Option value="Non-Binary">Non-Binary</Option>
                      <Option value="Prefer not to say">Prefer not to say</Option>
                    </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  id="height"
                  label="Height"
                  rules={[{ required: true, message: 'Please enter your height' }]}
                >
                  <Input placeholder="Ex. 5.11 Feet" />
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                  id="weight"
                  label="Weight"
                  rules={[{ required: true, message: 'Please enter your weight' }]}
                >
                  <Input placeholder="Ex. 150 Pounds" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  id="bloodType"
                  label="Blood Type"
                  rules={[{ required: true, message: 'Please enter your blood type' }]}
                >
                  <Select
                      //onSelect={this.handleDropdownChange}
                      placeholder="Ex. O-"
                      //value={this.state.description}
                      name="bloodType"
                    >
                      <Option value="A+">A+</Option>
                      <Option value="A-">A-</Option>
                      <Option value="B+">B+</Option>
                      <Option value="B-">B-</Option>
                      <Option value="O+">O+</Option>
                      <Option value="O-">O-</Option>
                      <Option value="AB+">AB+</Option>
                      <Option value="AB-">AB-</Option>
                    </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                  id="weight"
                  label="Weight"
                  rules={[{ required: true, message: 'Please enter your weight' }]}
                >
                  <Input placeholder="Ex. 150 Pounds" />
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



