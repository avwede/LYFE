import React, { Component } from 'react';
import { Button, Space, Popover, Form, Row, Col, Input } from 'antd';
import { EditFilled } from '@ant-design/icons';
import { CirclePicker } from 'react-color';
import 'antd/dist/antd.css';

class TagForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      tagName: '',
      tagColor: '',
    };
  }

  setupEditForm = (name, color) => {
    this.setState({ tagName: name, tagColor: color, visible: true });
  };

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleColorChange = (color) => {
    this.setState({ tagColor: color.hex });
  };

  handleTagUpdate = (id) => {
    const updatedTag = {
      type: this.state.tagName,
      color: this.state.tagColor,
    };

    this.props.updateTag(id, updatedTag);
    this.setState({ visible: false });
  };

  render() {
    return (
      <>
        <Popover
          visible={this.state.visible}
          trigger="click"
          onClick={() => this.setupEditForm(this.props.type, this.props.color)}
          onVisibleChange={this.handleVisibleChange}
          content={
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    id="name"
                    label="Rename Tag Type"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter a tag name',
                      },
                    ]}
                  >
                    <Input
                      name="tagName"
                      onChange={this.handleInputChange}
                      value={this.state.tagName}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <CirclePicker
                    color={this.props.color}
                    onChange={this.handleColorChange}
                  />
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button
                      type="link"
                      danger
                      onClick={() => this.props.deleteTag(this.props.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => this.handleTagUpdate(this.props.id)}
                    >
                      Update
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          }
        >
          <EditFilled style={{ display: 'inline-flex', paddingLeft: '10px' }} />
        </Popover>
      </>
    );
  }
}

export default TagForm;