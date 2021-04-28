import { Table, Button, Tag, Space } from 'antd';
import React from "react";
import 'antd/dist/antd.css';
import { PlusOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { Row, Col, Drawer, Form, Input, Select, DatePicker, Descriptions, Badge} from 'antd';
import { retrieveToken } from '../tokenStorage';
import { buildPath } from './bp'
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker'

class HealthProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      health: [],
    };
    this.healthForm = React.createRef();
  }

  formatDateString = () => {
    const dateCheck = new Date(this.state.health.dateOfBirth);
  
    return `${dateCheck.getMonth() + 1}/${dateCheck.getDate()}/${dateCheck.getFullYear()}`;
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
        console.log(this.state.health);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  updateHealth = (health) => {
    this.setState({ health: health });
  };

  handleEdit = () => {
    this.healthForm.current.showDrawer('edit', this.state.health);
  };

  render(){
    return (
      <>
          <Descriptions bordered style={{marginBottom: '40px', borderStyle:'double'}}>
          <Descriptions.Item label="Date of Birth" labelStyle={{background: '#DBF3FA', fontWeight: 'bold'}}>{this.formatDateString()}</Descriptions.Item>
          <Descriptions.Item label="Height (ft)" labelStyle={{background: '#DBF3FA', fontWeight: 'bold'}}>{this.state.health.height}</Descriptions.Item>
          <Descriptions.Item label="Weight (lbs)" labelStyle={{background: '#DBF3FA', fontWeight: 'bold'}}>{this.state.health.weight}</Descriptions.Item>
          <Descriptions.Item label="Gender" labelStyle={{background: '#DBF3FA', fontWeight: 'bold'}}>{this.state.health.gender}</Descriptions.Item>
          <Descriptions.Item label="Blood Type" span={2} labelStyle={{background: '#DBF3FA', fontWeight: 'bold'}}>{this.state.health.bloodType}</Descriptions.Item>
          {/* <Descriptions.Item label="Health Conditions" span={3} labelStyle={{background: '#DBF3FA', fontWeight: 'bold'}}>Diabetes</Descriptions.Item>
          <Descriptions.Item label="Allergies" span={3} labelStyle={{background: '#DBF3FA', fontWeight: 'bold'}}>Bees, Ants, Pollen, Amoxil, Peanuts</Descriptions.Item> */}
          </Descriptions>

          <Button type="primary" onClick={this.handleEdit} >
          <MedicineBoxOutlined /> Edit Health Profile
          </Button>


          <HealthProfileForm ref={this.healthForm} updateHealth={this.updateHealth}/> 
        </>
     ) 
  }
}
  

export default HealthProfile;


const { Option } = Select;

class HealthProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      visible: false,
      action: '',
      healthId: '',
      dateOfBirth: '',
      height: '',
      weight: '',
      gender: '',
      bloodType: '',
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

  editHealth = () => {
    const updatedHealth = {
      dateOfBirth: this.state.dateOfBirth,
      height: this.state.height,
      weight: this.state.weight,
      gender: this.state.gender,
      bloodType: this.state.bloodType
    };

    axios
      .put(
        buildPath('api/health/'),
        updatedHealth,
        {
          headers: {
            Authorization: `Bearer ${retrieveToken()}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        this.props.updateHealth(res.data);
        this.closeDrawer();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleDropdownChangeB = (value) => {
    this.setState({ bloodType: value });
  };

  handleDropdownChangeG = (value) => {
    this.setState({ gender: value });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  showDrawer = (action, health) => {
    if (action === 'edit') this.setupEditForm(health);
  };

  closeDrawer = () => {
    this.setState({
      visible: false,
    });
  };

  formatDateString = () => {
    const dateCheck = new Date(this.state.dateOfBirth);
  
    return `${dateCheck.getMonth() + 1}-${dateCheck.getDate()}-${dateCheck.getFullYear()}`;
  }

  setupEditForm = (health) => {
    console.log(health);

    this.setState({
      action: 'edit',
      visible: true,
      healthId: health._id,
      dateOfBirth: health.dateOfBirth,
      height: health.height,
      weight: health.weight,
      gender: health.gender,
      bloodType: health.bloodType,
    });
  };

  render() {
    return (
      <>
      <div className='site-form-in-drawer-wrapper'>


        <Drawer
          title="Edit Health Profile"
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
              <Button onClick={this.editHealth} type="primary">
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
                  <Input 
                    onChange={this.handleInputChange}
                    placeholder="Ex. 11/11/1999"
                    value={this.formatDateString()}
                    name="dateOfBirth" />
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
                      onSelect={this.handleDropdownChangeG}
                      placeholder="Ex. Male"
                      value={this.state.gender}
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
                  <Input 
                  onChange={this.handleInputChange}
                  placeholder="Ex. 5.11 Feet" 
                  value={this.state.height}
                  name="height"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                  id="weight"
                  label="Weight"
                  rules={[{ required: true, message: 'Please enter your weight' }]}
                >
                  <Input 
                  onChange={this.handleInputChange}
                  placeholder="Ex. 150 Pounds"  
                  value={this.state.weight}
                  name="weight" />
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
                      onSelect={this.handleDropdownChangeB}
                      placeholder="Ex. O-"
                      value={this.state.bloodType}
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
              {/* {<Col span={12}>
              { <Form.Item
                  id="healthConditions"
                  label="Health Conditions"
                  rules={[{ required: true, message: 'Please enter your health Conditions' }]}
                >
                  <Input placeholder="Ex. High Blood Pressure" />
                </Form.Item>
              </Col>} */}
            </Row>

          </Form>
        </Drawer>
        </div>
      </>
    );
  }
}



