import { useInterviewContext } from '@/context/InterviewContext'
import { Bullet } from '@ant-design/charts'
import { Card, Progress, Typography } from 'antd'
import React, { useEffect, useState } from 'react'

const OverallScoreContainer = () => {
    const interviewContext = useInterviewContext()
    const [accuracyScore, setAccuracyScore] = useState<number>()
    const [communicationScore, setCommunicationScore] = useState<number>()
    const [confidenceScore, setConfidencescore] = useState<number>() 
    useEffect(()=>{
        if(interviewContext.activeUserInterview?.nodes){
            for(const [nodeID, node] of Object.entries(interviewContext.activeUserInterview.nodes)){
                setAccuracyScore!(node.scores?.accuracy)
                setCommunicationScore!(node.scores?.communication)
                setConfidencescore!(node.scores?.confidence)
            }
        }
    },[interviewContext.activeUserInterview])
       
   
    const data = [
        {
            title: 'Communication',
            measures: communicationScore,
            target: 90,

        },
        {
            title: 'Accuracy',
            measures: accuracyScore,
            target: 90,

        },
        {
            title: 'Confidence',
            measures: confidenceScore,
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
        <div style={{ width: "500px" }}>
            <Card style={{ backgroundColor: "#dddddd" }}>
                <div style={{ display: "flex", flexDirection: "row", gap: "20px", justifyContent:"space-between", alignItems:"center"}}>
                    <div>
                        <Typography.Title level={3} style={{ marginBottom: "10px" }}>Overall Score</Typography.Title>
                        <Typography.Paragraph style={{ fontWeight: "bold" }}>Well done!</Typography.Paragraph>
                        <Typography.Paragraph style={{marginBottom:"27px"}}>
                            Keep practising and score higher
                        </Typography.Paragraph>
                    </div>
                    <div>
                        <Progress
                            type="dashboard"
                            percent={70} //TODO should be changed with real overall 
                            steps={{ count: 7, gap: 7 }}
                            trailColor="rgba(0, 0, 0, 0.06)"
                            strokeWidth={20}
                        />
                    </div>
                </div>

                {(communicationScore || accuracyScore || confidenceScore) ?<Bullet {...config} data={data} />: <Typography.Paragraph style={{height:"180px", display:'flex', justifyContent:"center", alignItems:"center",fontWeight:"bold", fontSize:'15px',marginBottom:"27px"}}>No scores to show at the moment</Typography.Paragraph>}
            </Card>
        </div>
    )
}

export default OverallScoreContainer