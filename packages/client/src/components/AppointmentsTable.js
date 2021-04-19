import { Table, Button, Tag, Space } from 'antd';
import React from "react";
import 'antd/dist/antd.css';
import { PlusOutlined } from '@ant-design/icons';
import { Row, Col, Drawer, Form, Input, Select, DatePicker} from 'antd';

function AppointmentsTable() {
  const columns = [
    {
      title: 'Appointment',
      dataIndex: 'appointment',
      key: 'appointment',
    },
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
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
        appointment: 'Dentist',
        date: '10/3/21',
        time: '11:30 AM'
    },
    {
        key: '2',
        appointment: 'Dentist',
        date: '10/3/21',
        time: '11:30 AM'
    },
    {
        key: '3',
        appointment: 'Dentist',
        date: '10/3/21',
        time: '11:30 AM'
    },
  ];


  return (
    <>
      <AppointmentsForm/>
     
      <Table columns={columns} dataSource={data} pagination={{defaultPageSize: 5}} style={{paddingBottom: '20px'}}/>
    </>
  );
}

export default AppointmentsTable;

const options = [{ value: 'School' }, { value: 'Health' }, { value: 'Exercise' }, { value: 'Medication' }];
const { Option } = Select;

class AppointmentsForm extends React.Component {
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
          <PlusOutlined /> New appointment
        </Button>

        <Drawer
          title="Add a new appointment"
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
                  name="Appointment"
                  label="Appointment"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the appointment description',
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="Ex. Dentist Appointment" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="Time"
                  label="Time"
                  rules={[{ required: true, message: 'Please enter the time' }]}
                >
                  <Input placeholder="Ex. 11:30 AM" />
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                  name="dateTime"
                  label="DateTime"
                  rules={[{ required: true, message: 'Please choose the dateTime' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    getPopupContainer={trigger => trigger.parentElement}
                  />
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

function tagRender(props) {
  const { label, value, closable, onClose } = props;

  return (
    <Tag color={'gold'} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
      {label}
    </Tag>
  );
}

