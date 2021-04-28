import React from "react";
import 'antd/dist/antd.css';
import { PlusOutlined, ExperimentOutlined, EditOutlined, DeleteOutlined , UsergroupAddOutlined} from '@ant-design/icons';
import { Button, Card, Row, Col, Drawer, Form, Input, Space, Table} from 'antd';
import { retrieveToken } from '../tokenStorage';
import { buildPath } from './bp'
import axios from 'axios';



class MedicationsTable extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      healthMeds: [],
    };
    this.medicationsForm = React.createRef();
    this.updateHealthMeds = this.updateHealthMeds.bind(this);
    this.editHealthMeds = this.editHealthMeds.bind(this);
  }

  updateHealthMeds(newMeds) {
    const meds = this.state.healthMeds;
    console.log(meds);
    meds.push(newMeds);
    this.setState({healthMeds: meds});
    const newMed = {
      medications : this.state.healthMeds,
    }

    axios
      .put(buildPath('api/health/'), newMed, {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        //console.log(res.data);
        this.updateMeds(res.data.medications);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getIndex(value, arr, prop) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i][prop] === value) {
            return i;
        }
      }
      return -1; //to handle the case where the value doesn't exist
  }

  editHealthMeds(eMed)
  {
    var editMed = this.state.healthMeds;
    var index = this.getIndex(eMed.name, editMed, 'name');
   
    //console.log(index);
    
    editMed[index] = eMed;

    const sendE = {
      medications: editMed,
    }

    axios
      .put(buildPath('api/health/'), sendE, {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.updateMeds(res.data.medications);
      })
      .catch((error) => {
        console.log(error);
      });
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
        this.setState({ healthMeds: res.data.medications });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteMed = (id) => {
    console.log(id);
    const deletedMed = this.state.healthMeds.filter(med => med._id !== id);
    console.log(deletedMed);
    this.setState({healthMeds: deletedMed});
    const newMed = {
      medications : deletedMed,
    }
    console.log(newMed);
    axios
      .put(buildPath('api/health/'), newMed, {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        //console.log(res.data);
        this.updateMeds(res.data.medications);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  columns = [
    {
      title: 'Medication Name',
      dataIndex: 'name',
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
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
              onClick={() => this.deleteMed(record._id)}
          />
        </Space>
      ),
    },
  ];

  updateMeds = (medication) => {
    console.log(medication);
    this.setState({ healthMeds: medication });
  };

  handleAdd = () => {
    this.medicationsForm.current.showDrawer('add');
  };

  handleEdit = (medication) => {
    this.medicationsForm.current.showDrawer('edit', medication);
  };
  
    render() {
      return (
        <div>
          <Table columns={this.columns} dataSource={this.state.healthMeds} pagination={{defaultPageSize: 5}} />

          <Button type="primary" onClick={this.handleAdd}>
            <ExperimentOutlined /> New medication
          </Button>

          <MedicationsForm
          ref={this.medicationsForm}
          updateMeds={this.updateMeds}
          updateHealthMeds={this.updateHealthMeds}
          editHealthMeds = {this.editHealthMeds}
        />
        </div>
      );
    }
}
  
export default MedicationsTable;

class MedicationsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      visible: false,
      action: '',
      medId: '',
      name: '',
      dosage: '',
      frequency: '',
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

  addMedication = () => {
    const newMed = {
      name: this.state.name,
      dosage: this.state.dosage,
      frequency: this.state.frequency,
    };

    this.props.updateHealthMeds(newMed);
    this.closeDrawer();
  };

  editMedication = () => {
    const updatedMeds = {
      name: this.state.name,
      dosage: this.state.dosage,
      frequency: this.state.frequency,
      }

     // console.log(this.tate.);

      this.props.editHealthMeds(updatedMeds)
      this.closeDrawer();
    };


  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  showDrawer = (action, medication) => {
    if (action === 'add') this.setupAddForm();

    if (action === 'edit') this.setupEditForm(medication);
  };

  closeDrawer = () => {
    this.setState({
      visible: false,
    });
  };

  setupEditForm = (medication) => {
    //console.log(medication);
    this.setState({
      action: 'edit',
      visible: true,
      medId: medication._id,
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
    });
    //console.log(this.state.name);
  };

  setupAddForm = () => {
    this.setState({
      action: 'add',
      visible: true,
      name: '',
      dosage: '',
      frequency: '',
    });
  };

  render() {
    return (
      <>
      <div className='site-form-in-drawer-wrapper'>

        <Drawer
            title={
              this.state.action === 'add' ? 'Add a new medication' : 'Edit a medication'
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
                      ? this.addMedication
                      : this.editMedication
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
                  id="name"
                  label="Medication Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the medication name',
                    },
                  ]}
                >
                  <Input 
                    onChange={this.handleInputChange}
                    placeholder="Ex. Naproxen"
                    value={this.state.name}
                    name="name" />
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                  id="dosage"
                  label="Dosage"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the dosage',
                    },
                  ]}
                >
                  <Input 
                    onChange={this.handleInputChange}
                    placeholder="Ex. 1 tablet (500mg)"
                    value={this.state.dosage}
                    name="dosage"  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  id="frequency"
                  label="Frequency"
                  rules={[{ required: true, message: 'Please enter the frequency' }]}
                >
                  <Input 
                    onChange={this.handleInputChange}
                    placeholder="Ex. Twice a day"
                    value={this.state.frequency}
                    name="frequency" />
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
