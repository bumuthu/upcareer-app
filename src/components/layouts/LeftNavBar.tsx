import { useAuthContext } from '@/context/AuthContext'
import { useGlobalContext } from '@/context/GlobalContext'
import { AppstoreOutlined, FileTextOutlined, LineChartOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Layout, Menu, Typography } from 'antd'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const LeftNavBar = ({ children }: { children: React.ReactNode }) => {
    const siderStyle: React.CSSProperties = {
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        insetInlineStart: 0,
        scrollbarWidth: 'thin',
        scrollbarColor: 'unset',
      };
      const [selectedKey, setSelectedKey] = useState('1');
      const authContext =useAuthContext();
      const router = useRouter();
      useEffect(()=>{

      },[selectedKey])

      const handleMenuClick = (key :any, route:any) => {
        setSelectedKey(key);
        if (route) {
          router.push(route);
        }
      };
    return (<>
      {  authContext.isAuthenticated &&
        <Layout hasSider>
            <Sider style={siderStyle}>
            <div style={{ padding: '20px', textAlign: 'center' }}>
          {/* Profile Section */}
          <Avatar size={64} icon={<UserOutlined />} />
          <Typography.Title level={5} style={{ margin: '10px 0 0', color:"white" }}>
            {authContext.currentUser?.name}
          </Typography.Title>
          <Typography.Text style={{color:"white"}}>{authContext.currentUser?.email}</Typography.Text>
        </div>

        {/* Menu Items */}
        <Menu selectedKeys={[selectedKey]} theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ paddingTop: '10px' }}>
          <Menu.Item key="1" onClick={() => handleMenuClick('1', '/')} icon={<AppstoreOutlined />}>
            Explore Interviews
          </Menu.Item>
          <Menu.Item key="2" onClick={() => handleMenuClick('2', '/my-interviews')} icon={<FileTextOutlined />}>
            My Interviews
          </Menu.Item>
          <Menu.Item key="3" onClick={() => handleMenuClick('3', '/my-progress')} icon={<LineChartOutlined />}>
            My Progress
          </Menu.Item>
          <Menu.Item key="4" onClick={() => handleMenuClick('4', '/my-account')} icon={<SettingOutlined />}>
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
      }</>
    )
}

export default LeftNavBar