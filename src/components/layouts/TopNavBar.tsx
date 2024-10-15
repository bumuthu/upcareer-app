"use client"
import React from "react";
import { Col, Row, Button, Avatar, Dropdown, Space, MenuProps, message } from "antd";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useAuthContext } from "../../context/AuthContext";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { HomeOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";

const TopNavBar = () => {
    const authContext = useAuthContext();
    const authUser = useKindeBrowserClient();
    const router = useRouter();

    const onClick: MenuProps['onClick'] = ({ key }) => {
        message.info(`Click on item ${key}`);
    };

    const items: MenuProps['items'] = [
        {
            label: 'Home',
            key: 'home',
            icon: <HomeOutlined />
        },
        {
            label: 'My Account',
            key: 'my_account',
            icon: <SettingOutlined />
        },
        {
            label: 'Logout',
            key: 'logout',
            icon: <LogoutOutlined />
        },
    ];

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 1000,
                backgroundColor: "white",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                paddingBottom: 5,
                paddingTop: 10,
            }}
        >
            <Row justify="space-around">
                <Col span={4}>
                    <img
                        src={"/logo-full-480.svg"}
                        style={{ width: 150, marginTop: 5, cursor: "pointer" }}
                        onClick={() => router.push("/")}
                    />
                </Col>
                <Col span={8}>
                    <Row justify="end">
                        <Button
                            type="text"
                            size="middle"
                            onClick={() => router.push("/")}
                            style={{ fontWeight: 600 }}
                        >
                            Interviews
                        </Button>
                        <Button
                            type="text"
                            size="middle"
                            onClick={() =>
                                window.open(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/`)
                            }
                            style={{ fontWeight: 600, marginLeft: 20 }}
                        >
                            Tutorial
                        </Button>
                        <div style={{ marginLeft: 50 }}>
                            {!authContext.isAuthenticated ? (
                                <Button
                                    loading={authUser.isLoading!}
                                    type="primary"
                                    size="middle"
                                    style={{ fontWeight: 600 }}
                                >
                                    <LoginLink>Log in</LoginLink>
                                </Button>
                            ) : (
                                <Dropdown menu={{ items, onClick }}>
                                    <span onClick={(e) => e.preventDefault()}>
                                        <Space>
                                            <Avatar size={30} icon={<UserOutlined />} />
                                        </Space>
                                    </span>
                                </Dropdown>
                            )}
                        </div>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default TopNavBar;
