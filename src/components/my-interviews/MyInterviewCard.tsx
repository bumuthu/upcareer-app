import { BaseInterviewModel, CategoryModel, UserInterviewModel } from '@/models/entities'
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Button, Card, Progress, Space, Typography } from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'

interface MyInterviewProps {
    userInterview: UserInterviewModel
}

const MyInterviewCard = (props: MyInterviewProps) => {
    const router = useRouter();

    const convertTimestampToDate = (timestamp: any) => {
        if (!timestamp) return
        const date = new Date(timestamp);
        return date?.toISOString().split('T')[0];
    }

    const onClickInterview = () => {
        router.push(`/my-interviews/${props.userInterview._id}`)
    }

    return (
        <Card style={{ width: 400, borderRadius: 5, boxShadow: "0px 5px 10px rgba(0,0,0,0.05)", cursor: "pointer" }} onClick={onClickInterview}>
            <Space direction="horizontal" align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                {/* Left Content */}
                <Space direction="vertical">
                    <Typography.Title level={4} style={{ margin: 0, height: "20px" }}>
                        {(props.userInterview.baseInterview as BaseInterviewModel).title}
                    </Typography.Title>
                    <Typography.Text style={{ color: '#1890ff' }}>{((props.userInterview.baseInterview as BaseInterviewModel).category as CategoryModel).name}</Typography.Text>

                    {/* Time and Date */}
                    <Space style={{ marginTop: "65px" }}>
                        <ClockCircleOutlined />
                        <Typography.Text>43 min</Typography.Text>
                    </Space>
                    <Space>
                        <CalendarOutlined />
                        <Typography.Text>{convertTimestampToDate(props.userInterview.startedAt)}</Typography.Text>
                    </Space>
                </Space>

                {/* Right Content - Progress Circle */}
                <div style={{ textAlign: 'center', display: "flex", flexDirection: "column" }}>
                    <Progress
                        style={{ marginBottom: 10 }}
                        type="circle"
                        percent={90}
                        width={80}
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                        format={percent => `${percent}%`}
                    />
                    <Typography.Text type="secondary" style={{ color: "#0D99FF", width: "100px" }}>Above Average</Typography.Text>
                    <div style={{ textAlign: 'right', marginTop: 20 }}>
                        <Button type="text" style={{ fontWeight: "bold" }}>Read More</Button>
                    </div>
                </div>
            </Space>
        </Card>
    )
}

export default MyInterviewCard