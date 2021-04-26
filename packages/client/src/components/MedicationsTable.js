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
  }

  updateHealthMeds(newMeds) {
    const meds = this.state.healthMeds;
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
        this.updateMeds(res.data.medication);
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

  deleteMed = () => {
    axios
      .delete(buildPath('api/health/'), {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ healthMeds: res.data.medications });
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
              onClick={() => this.deleteMedication(record._id)}
          />
        </Space>
      ),
    },
  ];

  updateMeds = (medication) => {
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

      axios
      .put(buildPath('api/health/'), updatedMeds, {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.props.updateMeds(res.data.medication);
        this.closeDrawer();
      })
      .catch((error) => {
        console.log(error);
      });
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
    this.setState({
      action: 'edit',
      visible: true,
      medId: medication._id,
      name: medication.firstName,
      dosage: medication.lastName,
      frequency: medication.email,
    });
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

// class AllergiesCards extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       healthAllerg: [],
//     };
//     this.allergiesForm = React.createRef();
//   }

//   componentDidMount() {
//     axios
//       .get(buildPath('api/health/'), {
//         headers: {
//           Authorization: `Bearer ${retrieveToken()}`,
//           'Content-Type': 'application/json',
//         },
//       })
//       .then((res) => {
//         this.setState({ allergies: res.data });
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   }

//   deleteAllergies = (id) => {
//     axios
//       .delete(buildPath(`api/health/${id}`), {
//         headers: {
//           Authorization: `Bearer ${retrieveToken()}`,
//           'Content-Type': 'application/json',
//         },
//       })
//       .then((res) => {
//         this.setState({ allergies: res.data });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   updateAllergies = (allergies) => {
//     this.setState({ allergies: allergies });
//   };

//   handleAdd = () => {
//     this.allergiesForm.current.showDrawer('add');
//   };

//   handleEdit = (allergies) => {
//     this.allergiesForm.current.showDrawer('edit', allergies);
//   };
  
//     render () {
//         return (
//             <>
//             {/* {this.state.healthAllerg.allergies.map((allergy) =>
//                 <Card type="inner" style={{ marginTop: 16 }} title={allergy}>
//                   Reaction: Redness, Inflammation
//                 </Card> 
            
//             )} */}

//                 <AllergiesForm />
//             </>
            
//         );
//     }
// }

// export default AllergiesCards;

// class AllergiesForm extends React.Component {
//     state = { visible: false };
  
//     showDrawer = () => {
//       this.setState({
//         visible: true,
//       });
//     };
  
//     onClose = () => {
//       this.setState({
//         visible: false,
//       });
//     };
  
//     render() {
//       return (
//         <>
//         <div className='site-form-in-drawer-wrapper'>
  
//           <Button type="primary" onClick={this.showDrawer}>
//             <WarningOutlined /> New allergy
//           </Button>
  
//           <Drawer
//             title="Add a new allergy"
//             width={720}
//             onClose={this.onClose}
//             visible={this.state.visible}
//             bodyStyle={{ paddingBottom: 80 }}
//             footer={
//               <div
//                 style={{
//                   textAlign: 'right',
//                 }}
//               >
//                 <Button onClick={this.onClose} style={{ marginRight: 8 }}>
//                   Cancel
//                 </Button>
//                 <Button onClick={this.onClose} type="primary">
//                   Submit
//                 </Button>
//               </div>
//             }
//           >
//             <Form layout="vertical" hideRequiredMark>
//             <Row gutter={16}>
//                 <Col span={24}>
//                   <Form.Item
//                     name="Allergy"
//                     label="Allergy"
//                     rules={[
//                       {
//                         required: true,
//                         message: 'Please enter the allergy description',
//                       },
//                     ]}
//                   >
//                     <Input.TextArea rows={4} placeholder="Ex. Peanuts" />
//                   </Form.Item>
//                 </Col>
//               </Row>
//               <Row gutter={16}>
//               <Col span={24}>
//                   <Form.Item
//                     name="Reaction"
//                     label="Reaction"
//                     rules={[
//                       {
//                         required: true,
//                         message: 'Please enter the reaction to the allergy',
//                       },
//                     ]}
//                   >
//                     <Input.TextArea rows={4} placeholder="Ex. Hives, Redness, Swelling, Nausea" />
//                   </Form.Item>
//                 </Col>
                
//               </Row>
//             </Form>
//           </Drawer>
//           </div>
//         </>
//       );
//     }
//   }