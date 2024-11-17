import { useInterviewContext } from '@/context/InterviewContext'
import { Bullet } from '@ant-design/charts'
import { Card, Progress, Typography } from 'antd'
import React from 'react'

const OverallScoreContainer = () => {
    const interviewContext = useInterviewContext()
    const data = [
        {
            title: 'Communication',
            measures: 50,
            target: 90,

        },
        {
            title: 'Accuracy',
            measures: 45,
            target: 90,

        },
        {
            title: 'Confidence',
            measures: 92,
            target: 90,

        },
    ];

    const config = {
        data,
        height: 200,
        measureSize: 5,
        colorField: "title",
        color: (title: string) => {
            if (title === 'Communication') return '#A19DFF';
            if (title === 'Accuracy') return '#FF9D9F';
            if (title === 'Confidence') return '#6EC38A';
            return '#d9d9d9';
        },
        xField: 'title',
        layout: 'horizontal',

    };
    return (
        <div style={{ width: "100%" }}>
            <Card style={{ backgroundColor: "#dddddd" }}>
                <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                    <div>
                        <Typography.Title level={3} style={{ marginBottom: "10px" }}>Overall Score</Typography.Title>
                        <Typography.Paragraph style={{ fontWeight: "bold" }}>Well done!</Typography.Paragraph>
                        <Typography.Paragraph>
                            Keep practising and score higher
                        </Typography.Paragraph>
                    </div>
                    <div>
                        <Progress
                            type="dashboard"
                            percent={70}
                            steps={{ count: 7, gap: 7 }}
                            trailColor="rgba(0, 0, 0, 0.06)"
                            strokeWidth={20}
                        />
                    </div>
                </div>

                <Bullet
                    {...config} data={data}
                />


            </Card>
        </div>
    )
}

export default OverallScoreContainer