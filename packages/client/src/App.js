import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import './App.css';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;



function App() {
  return (
    <Layout>
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
        <Menu.Item key="1">nav 1</Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
        <Sider className="site-layout-background" width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%' }}
          >
            <SubMenu key="sub1" icon={<UserOutlined />} title="Health">
              <Menu.Item key="1">Health Information</Menu.Item>
              <Menu.Item key="2">Emergency Contacts</Menu.Item>
              <Menu.Item key="3">Allergies</Menu.Item>
              <Menu.Item key="4">Medications</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<LaptopOutlined />} title="School">
              <Menu.Item key="5">Classes</Menu.Item>
              <Menu.Item key="6">Textbooks</Menu.Item>
              <Menu.Item key="7">Zoom Links</Menu.Item>
              <Menu.Item key="8">Goals</Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" icon={<NotificationOutlined />} title="Reminders">
              <Menu.Item key="9">Assignments</Menu.Item>
              <Menu.Item key="10">Errands</Menu.Item>
              <Menu.Item key="11">Exercise</Menu.Item>
              <Menu.Item key="12">Medications</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content>
      </Layout>
    </Content>
    <Footer style={{ textAlign: 'center' }}>LYFE ©2021</Footer>
    </Layout>
    );
  }

export default App;
