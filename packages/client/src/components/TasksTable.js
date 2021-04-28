import ReactDOM from 'react-dom';
import { Table, Button, Tag, Space, Pagination, InputNumber, Popconfirm, Typography  } from 'antd';
import React, { Component, useState } from "react";
import 'antd/dist/antd.css';
import { DeleteOutlined, EditOutlined, PlusOutlined, CarryOutOutlined } from '@ant-design/icons';
import { Layout, Menu, Tooltip, Progress, Row, Col, Drawer, Form, Input, Select, DatePicker} from 'antd';
import { retrieveToken } from '../tokenStorage';
import { buildPath } from './bp'
import axios from 'axios';

const { Option } = Select;

class TasksTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      prettyDate: '',
    };
    this.tasksForm = React.createRef();
  }

  formatDateString = () => {
    const dateCheck = new Date(this.state.prettyDate);
  
    return `${dateCheck.getMonth() + 1}/${dateCheck.getDate()}/${dateCheck.getFullYear()}`;
  }

  componentDidMount() {
    axios
      .get(buildPath('api/reminders/'), {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ tasks: res.data, prettyDate: res.data.startDate});
        // this.setState({ tasks.startDate : newDate});
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteTask = (id) => {
    axios
      .delete(buildPath(`api/reminders/${id}`), {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.updateTasks(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  columns = [
    {
      title: 'Tasks',
      dataIndex: 'name',
    },
    {
      title: 'Date',
      dataIndex: 'startDate',

    },
    // {
    //   title: 'Tags',
    //   key: 'description', 
    //   dataIndex: 'description',
    //   render: (text, description) => (
    //     <>
    //       {this.state.tasks.map((tag) => {
    //         let color = 'gray';
            
    //         if (tag.description === 'School') {
    //           color = 'geekblue';
    //         }
    //         else if (tag.description == 'Appointments'){
    //           color = 'green';
    //         }
    //         else if (tag.description == 'Medication'){
    //           color = 'volcano';
    //         }
    //         else if (tag.description == 'Exercise'){
    //           color = 'purple';
    //         }
    //         else if (tag.description == 'Other'){
    //           color = 'magenta';
    //         }
    //         return (
    //           <Tag color={color} key={tag}>
    //             {tag.description.toUpperCase()}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
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
              onClick={() => this.deleteTask(record._id)}
          />
        </Space>
      ),
    },
  ];

  updateTasks = (tasks) => {
    this.setState({ tasks: tasks });
  };

  handleAdd = () => {
    this.tasksForm.current.showDrawer('add');
  };

  handleEdit = (task) => {
    this.tasksForm.current.showDrawer('edit', task);
  };
  
    render() {
      return (
        <div>
          <Table columns={this.columns} dataSource={this.state.tasks} pagination={{defaultPageSize: 5}} />

          <Button type="primary" onClick={this.handleAdd}>
            <CarryOutOutlined /> New Task
          </Button>

          <TasksForm
          ref={this.tasksForm}
          updateTasks={this.updateTasks}
        />
        </div>
      );
    }
  }
  
export default TasksTable;

class TasksForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      visible: false,
      action: '',
      taskId: '',
      name: '',
      startDate: '',
      description: '',
    };
  }

  formatDateString = () => {
    const dateCheck = new Date(this.state.startDate);
  
    return `${dateCheck.getMonth() + 1}-${dateCheck.getDate()}-${dateCheck.getFullYear()}`;
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

  addTask = () => {
    const newTask = {
      name: this.state.name,
      startDate: this.state.startDate,
      description: this.state.description,
    };

    axios
      .post(buildPath('api/reminders/'), newTask, {
        headers: {
          Authorization: `Bearer ${retrieveToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.props.updateTasks(res.data);
        this.closeDrawer();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  editTask = () => {
    const updatedTask = {
      name: this.state.name,
      startDate: this.state.startDate,
      description: this.state.description,
    };

    axios
      .put(
        buildPath(`api/reminders/${this.state.taskId}`),
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${retrieveToken()}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        this.props.updateTasks(res.data);
        this.closeDrawer();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleDropdownChange = (value) => {
    this.setState({ description: value });
  };

  showDrawer = (action, task) => {
    if (action === 'add') this.setupAddForm();

    if (action === 'edit') this.setupEditForm(task);
  };

  closeDrawer = () => {
    this.setState({
      visible: false,
    });
  };

  setupEditForm = (task) => {
    this.setState({
      action: 'edit',
      visible: true,
      taskId: task._id,
      name: task.name,
      startDate: task.startDate,
      description: task.description,
    });
  };

  setupAddForm = () => {
    this.setState({
      action: 'add',
      visible: true,
      name: '',
      startDate: '',
      description: '',
    });
  };

  render() {
    return (
      <>
      <div className='site-form-in-drawer-wrapper'>

        <Drawer
            title={
              this.state.action === 'add' ? 'Add a new task' : 'Edit a task'
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
                      ? this.addTask
                      : this.editTask
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
              <Col span={24}>
                <Form.Item
                  id="name"
                  label="Task"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter task',
                    },
                  ]}
                >
                  <Input 
                    onChange={this.handleInputChange}
                    placeholder="Ex. Do COP 4331 discussion post"
                    value={this.state.name}
                    name="name" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                  id="startDate"
                  label="Date"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the date',
                    },
                  ]}
                >
                  <Input 
                    onChange={this.handleInputChange}
                    placeholder="Ex. YYYY-MM-DD"
                    value={this.state.action === 'add' ? this.state.startDate : this.formatDateString()}
                    name="startDate" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  id="description"
                  label="Tags"
                  rules={[{ required: true, message: 'Please enter the appropriate tags' }]}
                >
                  <Select
                      onSelect={this.handleDropdownChange}
                      placeholder="Ex. School"
                      value={this.state.description}
                      name="description"
                    >
                      <Option value="School">School</Option>
                      <Option value="Appointments">Appointments</Option>
                      <Option value="Medication">Medication</Option>
                      <Option value="Exercise">Exercise</Option>
                      <Option value="Other">Other</Option>
                    </Select>
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


// const columns = [
//   {
//     title: 'Task',
//     dataIndex: 'task',
//     key: 'task',
//     render: text => <a>{text}</a>,
//   },
//   {
//     title: 'Date',
//     dataIndex: 'date',
//     key: 'date',
//   },
//   {
//     title: 'Tags',
//     key: 'tags',
//     dataIndex: 'tags',
//     render: tags => (
//       <>
//         {tags.map(tag => {
//           let color = tag.length > 5 ? 'geekblue' : 'green';
//           if (tag === 'School') {
//             color = 'geekblue';
//           }
//           else if (tag == 'Health'){
//             color = 'green';
//           }
//           else if (tag == 'Medication'){
//             color = 'volcano';
//           }
//           else if (tag == 'Exercise'){
//             color = 'purple';
//           }
//           return (
//             <Tag color={color} key={tag}>
//               {tag.toUpperCase()}
//             </Tag>
//           );
//         })}
//       </>
//     ),
//   },
//   {
//     title: 'Action',
//     key: 'action',
//     render: (text, record) => (
//       <Space size="middle">
//         <a>Edit</a>
//         <a>Delete</a>
//       </Space>
//     ),
//   },
// ];

// const data = [
//   {
//     key: '1',
//     task: 'Finish essay',
//     date: '10/3/21',
//     tags: ['School'],
//   },
//   {
//     key: '2',
//     task: 'Take tylenol',
//     date: '11/11/11',
//     tags: ['Medication', 'Health'],
//   },
// ];

// class TasksTable extends React.Component{

//   constructor(props) {
//     super(props);
//     this.state = {
//       tasks: [],
//     };
//   }

//   componentDidMount() {
//     axios
//       .get(buildPath('api/reminders/'), {
//         headers: {
//           Authorization: `Bearer ${retrieveToken()}`,
//           'Content-Type': 'application/json',
//         },
//       })
//       .then((res) => {
//         this.setState({ tasks: res.data });
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   }

//   render(){
//     return(
//         <>
//         <TasksForm/>
//         <Table columns={columns} dataSource={data} pagination={{defaultPageSize: 5}} />
//       </>
//     )
//   }
    
// }

// export default TasksTable; 




// const options = [{ value: 'School' }, { value: 'Health' }, { value: 'Exercise' }, { value: 'Medication' }];
// const { Option } = Select;



// class TasksForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       visible: false,
//       task: '',
//       courseCode: '',
//       professor: '',
//       locationType: '',
//       location: '',
//     };
//   }

//   // addTask = () => {
//   //   const newTask = {
//   //     courseCode: this.state.courseCode,
//   //     professor: this.state.professor,
//   //     location: {
//   //       type: this.state.locationType,
//   //       location: this.state.location,
//   //     },
//   //   };

//   //   axios
//   //     .post(buildPath('api/courses/'), newTask, {
//   //       headers: {
//   //         Authorization: `Bearer ${retrieveToken()}`,
//   //         'Content-Type': 'application/json',
//   //       },
//   //     })
//   //     .then((res) => {
//   //       this.props.updateCourses(res.data);
//   //       this.closeDrawer();
//   //     })
//   //     .catch((error) => {
//   //       console.log(error);
//   //     });
//   // };
//   showDrawer = () => {
//     this.setState({
//       visible: true,
//     });
//   };

//   onClose = () => {
//     this.setState({
//       visible: false,
//     });
//   };

//   render() {
//     return (
//       <>
//       <div className='site-form-in-drawer-wrapper'>

//         <Button type="primary" onClick={this.showDrawer}>
//           <PlusOutlined /> New task
//         </Button>

//         <Drawer
//           title="Create a new task"
//           width={720}
//           onClose={this.onClose}
//           visible={this.state.visible}
//           bodyStyle={{ paddingBottom: 80 }}
//           footer={
//             <div
//               style={{
//                 textAlign: 'right',
//               }}
//             >
//               <Button onClick={this.onClose} style={{ marginRight: 8 }}>
//                 Cancel
//               </Button>
//               <Button onClick={this.onClose} type="primary">
//                 Submit
//               </Button>
//             </div>
//           }
//         >
//           <Form layout="vertical" hideRequiredMark>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item
//                   name="Task"
//                   label="Task"
//                   rules={[{ required: true, message: 'Please enter task' }]}
//                 >
//                   <Input placeholder="Please enter task" />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//               <Form.Item
//                   name="dateTime"
//                   label="DateTime"
//                   rules={[{ required: true, message: 'Please choose the dateTime' }]}
//                 >
//                   <DatePicker
//                     style={{ width: '100%' }}
//                     getPopupContainer={trigger => trigger.parentElement}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item
//                   name="owner"
//                   label="Owner"
//                   rules={[{ required: true, message: 'Please select an owner' }]}
//                 >
//                   <Select
//                       mode="multiple"
//                       showArrow
//                       tagRender={tagRender}
//                       style={{ width: '100%' }}
//                       options={options}
//                     />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   name="type"
//                   label="Type"
//                   rules={[{ required: true, message: 'Please choose the type' }]}
//                 >
//                   <Select placeholder="Please choose the type">
//                     <Option value="private">Private</Option>
//                     <Option value="public">Public</Option>
//                   </Select>
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item
//                   name="approver"
//                   label="Approver"
//                   rules={[{ required: true, message: 'Please choose the approver' }]}
//                 >
//                   <Select placeholder="Please choose the approver">
//                     <Option value="jack">Jack Ma</Option>
//                     <Option value="tom">Tom Liu</Option>
//                   </Select>
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   name="dateTime"
//                   label="DateTime"
//                   rules={[{ required: true, message: 'Please choose the dateTime' }]}
//                 >
//                   <DatePicker
//                     style={{ width: '100%' }}
//                     getPopupContainer={trigger => trigger.parentElement}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row gutter={16}>
//               <Col span={24}>
//                 <Form.Item
//                   name="description"
//                   label="Description"
//                   rules={[
//                     {
//                       required: true,
//                       message: 'please enter url description',
//                     },
//                   ]}
//                 >
//                   <Input.TextArea rows={4} placeholder="please enter url description" />
//                 </Form.Item>
//               </Col>
//             </Row>
//           </Form>
//         </Drawer>
//         </div>
//       </>
//     );
//   }
// }

// function tagRender(props) {
//   const { label, value, closable, onClose } = props;

//   return (
//     <Tag color={'gold'} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
//       {label}
//     </Tag>
//   );
// }

