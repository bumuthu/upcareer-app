import { BaseInterviewModel, CategoryModel, UserInterviewModel } from '@/models/entities'
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Card, Progress, Space, Typography } from 'antd'
import React from 'react'

interface MyInterviewProps {
  userInterview: UserInterviewModel
}

const MyInterviewCard = (props: MyInterviewProps) => {
  return (
    <Card style={{ width: 400, borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
    <Space direction="horizontal" align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
      {/* Left Content */}
      <Space direction="vertical">
        <Typography.Title level={4} style={{ margin: 0 }}>
          {(props.userInterview.baseInterview as BaseInterviewModel).title }
        </Typography.Title>
        <Typography.Text style={{ color: '#1890ff' }}>{((props.userInterview.baseInterview as BaseInterviewModel).category as CategoryModel).name}</Typography.Text>

        {/* Time and Date */}
        <Space>
          <ClockCircleOutlined />
          <Typography.Text>43 min</Typography.Text>
        </Space>
        <Space>
          <CalendarOutlined />
          <Typography.Text>13/09/2024</Typography.Text>
        </Space>
      </Space>

      {/* Right Content - Progress Circle */}
      <div style={{ textAlign: 'center' }}>
        <Progress
          type="circle"
          percent={90}
          width={80}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          format={percent => `${percent}%`}
        />
        <Typography.Text type="secondary">Above Average</Typography.Text>
      </div>
    </Space>

    {/* Read More */}
    <div style={{ textAlign: 'right', marginTop: 20 }}>
      <Typography.Link>READ MORE</Typography.Link>
    </div>
  </Card>
  )
}

export default MyInterviewCard