import { Bullet } from '@ant-design/charts'
import { Card, Progress, Typography } from 'antd'
import React from 'react'

const QuestionScoreContainer = () => {
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
    <div style={{width:"100%"}}>
      <Card>
      <Typography.Title level={3} style={{ marginBottom: "10px" }}>Question Score</Typography.Title>
                    <div style={{display:"flex", flexDirection:"column",  alignItems:"center"}}>
                        
                        <Typography.Paragraph style={{ fontWeight: "bold", margin:"0"}}>What is JSX</Typography.Paragraph>
                        <Typography.Paragraph>
                        You answer’s results
                        </Typography.Paragraph>
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

export default QuestionScoreContainer