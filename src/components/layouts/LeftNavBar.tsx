import { AppstoreOutlined, FileTextOutlined, LineChartOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Layout, Menu, Typography } from 'antd'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import React from 'react'

const LeftNavBar = ({ children }: { children: React.ReactNode }) => {
    const siderStyle: React.CSSProperties = {
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        insetInlineStart: 0,
        scrollbarWidth: 'thin',
        scrollbarColor: 'unset',
      };
    return (
        <Layout hasSider>
            <Sider style={siderStyle}>
            <div style={{ padding: '20px', textAlign: 'center' }}>
          {/* Profile Section */}
          <Avatar size={64} icon={<UserOutlined />} />
          <Typography.Title level={5} style={{ margin: '10px 0 0', color:"white" }}>
            Bumuthu Dilshan
          </Typography.Title>
          <Typography.Text style={{color:"white"}}>bumuthudilshan@gmail.com</Typography.Text>
        </div>

        {/* Menu Items */}
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ paddingTop: '10px' }}>
          <Menu.Item key="1" icon={<AppstoreOutlined />}>
            Explore Interviews
          </Menu.Item>
          <Menu.Item key="2" icon={<FileTextOutlined />}>
            My Interviews
          </Menu.Item>
          <Menu.Item key="3" icon={<LineChartOutlined />}>
            My Progress
          </Menu.Item>
          <Menu.Item key="4" icon={<SettingOutlined />}>
            My Account
          </Menu.Item>
        </Menu>
            </Sider>
            <Layout style={{ marginLeft: 250 }}>
                <Content>
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}

export default LeftNavBar