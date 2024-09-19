import React from 'react';
import { Col, Row, Button } from 'antd';
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { useAuthContext } from '../../context/AuthContext';

const TopNavBar = () => {
    const authContext = useAuthContext();

    const onClickInterviews = () => {
        console.log("Clicked interviews")
    }
    return (
        <div style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', paddingBottom: 5, paddingTop: 5 }}>
            <Row justify="space-around" >
                <Col span={4}>
                    <img src={"/logo-full-480.svg"} style={{ width: 150, marginTop: 5 }} />
                </Col>
                <Col span={8}>
                    <Row justify="end" >
                        <Button type="text" size='middle' onClick={onClickInterviews} style={{ fontWeight: 600 }}>
                            Interviews
                        </Button>
                        <Button type="text" size='middle' onClick={onClickInterviews} style={{ fontWeight: 600, marginLeft: 20 }}>
                            Tutorial
                        </Button>
                        {
                            !authContext.isAuthenticated && <Button type="primary" size='middle' style={{ fontWeight: 600, marginLeft: 50 }}>
                                <LoginLink>Log in</LoginLink>
                            </Button>
                        }
                    </Row>
                </Col>
            </Row>
        </div >
    )

}

export default TopNavBar;