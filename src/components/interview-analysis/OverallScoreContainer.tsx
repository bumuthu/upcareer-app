import { useInterviewContext } from '@/context/InterviewContext'
import { Bullet } from '@ant-design/charts'
import { Card, Progress, Typography } from 'antd'
import React from 'react'

const OverallScoreContainer = () => {
    const interviewContext = useInterviewContext()
    const data = [
        {
            title: 'Communication',
            ranges: 100, // The target bar length
            measures: 86, // The actual value
            target: 86,

        },
        {
            title: 'Accuracy',
            ranges: 100,
            measures: 45,
            target: 92,

        },
        {
            title: 'Confidence',
            ranges: 100,
            measures: 92,
            target: 92,

        },
    ];

    const config = {
        data,
        height: 100,
        measureSize: 12,
        colorField: "title",
        color: (title: string) => {
            if (title === 'Communication') return '#A19DFF';
            if (title === 'Accuracy') return '#FF9D9F';
            if (title === 'Confidence') return '#6EC38A';
            return '#d9d9d9';
        },
        xField: 'title',
        yField: 'measures',
        layout: 'horizontal',
        label: {
            position: 'left',
            style: {
                fill: 'gray',
                fontSize: 12,
            },
        },
    };
    return (
        <div style={{ width: "100%" }}>
            <Card style={{backgroundColor:"#dddddd"}}>
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

                {data.map((item, index) => (
                    <div key={index} >

                        <Bullet
                            {...config} data={[item]}
                        />
                    </div>
                ))}


            </Card>
        </div>
    )
}

export default OverallScoreContainer