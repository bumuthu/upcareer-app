import { Bullet } from '@ant-design/charts'
import { Card, Progress, Typography } from 'antd'
import React from 'react'

const QuestionScoreContainer = () => {
    const data = [
        {
            title: 'Communication',
            measures: 86,
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
            <Card>
                <Typography.Title level={3} style={{ marginBottom: "10px" }}>Question Score</Typography.Title>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                    <Typography.Paragraph style={{ fontWeight: "bold", margin: "0" }}>What is JSX</Typography.Paragraph>
                    <Typography.Paragraph>
                        You answer’s results
                    </Typography.Paragraph>
                </div>

                <Bullet
                    {...config} data={data}
                />
            </Card>
        </div>
    )
}

export default QuestionScoreContainer