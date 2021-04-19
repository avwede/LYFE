import React from "react";
import 'antd/dist/antd.css';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Row, Col, Drawer, Form, Input } from 'antd';

class AllergiesCards extends React.Component {
    render () {
        return (
            <>
                <Card type="inner" title="Peanuts">
                    Reaction: Rash, Hives, Swelling 
                </Card>

                <Card type="inner" style={{ marginTop: 16 }} title="Penicillin">
                    Reaction: Redness, Inflammation
                </Card> 

                <AllergiesForm />
            </>
            
        );
    }
}

export default AllergiesCards;

class AllergiesForm extends React.Component {
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
            <PlusOutlined /> New allergy
          </Button>
  
          <Drawer
            title="Add a new allergy"
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
                    name="Allergy"
                    label="Allergy"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the allergy description',
                      },
                    ]}
                  >
                    <Input.TextArea rows={4} placeholder="Ex. Peanuts" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
              <Col span={24}>
                  <Form.Item
                    name="Reaction"
                    label="Reaction"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the reaction to the allergy',
                      },
                    ]}
                  >
                    <Input.TextArea rows={4} placeholder="Ex. Hives, Redness, Swelling, Nausea" />
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