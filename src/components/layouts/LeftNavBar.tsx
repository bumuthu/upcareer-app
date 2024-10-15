import { useAuthContext } from '@/context/AuthContext'
import { useGlobalContext } from '@/context/GlobalContext'
import { SelectableSection } from '@/models/enum'
import { AppstoreOutlined, FileTextOutlined, LineChartOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Layout, Menu, Typography } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const LeftNavBar = ({ children }: { children: React.ReactNode }) => {
    const siderStyle: React.CSSProperties = {
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        insetInlineStart: 0,
        scrollbarWidth: 'thin',
        scrollbarColor: 'unset',
        paddingTop: "75px"
    };
    const authContext = useAuthContext();
    const globalContext = useGlobalContext();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);


    const adjustMargin = () => {
        if (collapsed)
            return 90
        return 200
    }
    return (<>
        {authContext.isAuthenticated ?
            <Layout hasSider>
                <Sider style={siderStyle} collapsible collapsed={collapsed}
                    onCollapse={(collapsed) => setCollapsed(collapsed)}
                    breakpoint="lg">
                    {!collapsed && <div style={{ padding: '20px', textAlign: 'center' }}>
                        {/* Profile Section */}
                        <Avatar size={64} icon={<UserOutlined />} />
                        <Typography.Title level={5} style={{ margin: '10px 0 0', color: "white" }}>
                            {authContext.currentUser?.name}
                        </Typography.Title>
                        <Typography.Text style={{ color: "white" }}>{authContext.currentUser?.email}</Typography.Text>
                    </div>}

                    {/* Menu Items */}

                    <Menu selectedKeys={[globalContext.selectedSection!]} theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ paddingTop: '10px' }}>
                        <Menu.Item key={SelectableSection.EXPLORE_INTERVIEWS} onClick={() => { globalContext.setSelectedSection!(SelectableSection.EXPLORE_INTERVIEWS); router.push('/') }} icon={<AppstoreOutlined />}>
                            Explore Interviews
                        </Menu.Item>
                        <Menu.Item key={SelectableSection.MY_INTERVIEWS} onClick={() => { globalContext.setSelectedSection!(SelectableSection.MY_INTERVIEWS); router.push('/my-interviews') }} icon={<FileTextOutlined />}>
                            My Interviews
                        </Menu.Item>
                        <Menu.Item key={SelectableSection.MY_PROGRESS} onClick={() => { globalContext.setSelectedSection!(SelectableSection.MY_PROGRESS); router.push('/my-progress') }} icon={<LineChartOutlined />}>
                            My Progress
                        </Menu.Item>
                        <Menu.Item key={SelectableSection.MY_ACCOUNT} onClick={() => { globalContext.setSelectedSection!(SelectableSection.MY_ACCOUNT); router.push('/my-account') }} icon={<SettingOutlined />}>
                            My Account
                        </Menu.Item>
                    </Menu>

                </Sider>
                <Layout style={{ marginLeft: adjustMargin() }}>
                    <Content style={{ height: 'calc(100vh - 10px)', overflow: 'auto' }}>
                        {children}
                    </Content>
                </Layout>
            </Layout> :
            <>{children}</>
        }</>
    )
}

export default LeftNavBar