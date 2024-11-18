import { useInterviewContext } from '@/context/InterviewContext'
import { FormattedTreeData } from '@/services/client-side/interview-node-service'
import { Bullet } from '@ant-design/charts'
import { Card, Progress, Typography } from 'antd'
import React, { useEffect, useState } from 'react'

const QuestionScoreContainer = () => {
    const interviewContext = useInterviewContext()
    const [treeNode, setTreeNode] = useState<FormattedTreeData>();

    useEffect(() => {
        setTreeNode(interviewContext.interviewNodeService?.formatTree().find(item => item.id === interviewContext.selectedCardId));
      }, [interviewContext.selectedCardId])
    const data = [
        {
            title: 'Communication',
            measures: treeNode?.node.scores?.communication,
            target: 90,

        },
        {
            title: 'Accuracy',
            measures: treeNode?.node.scores?.accuracy,
            target: 90,

        },
        {
            title: 'Confidence',
            measures: treeNode?.node.scores?.confidence,
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
            <Card>
                <Typography.Title level={3} style={{ marginBottom: "10px" }}>Question Score</Typography.Title>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>

                    <Typography.Paragraph style={{ display:"flex",fontWeight: "bold", margin: "0", height:"50px", justifyContent:"center",width:"400px"}}>{treeNode?.node.question?? "No selected question"}</Typography.Paragraph>
                    <Typography.Paragraph>
                        You answer’s results
                    </Typography.Paragraph>
                </div>

                {(treeNode?.node.scores?.communication || treeNode?.node.scores?.accuracy || treeNode?.node.scores?.confidence) ?<Bullet {...config} data={data}/>: <Typography.Paragraph style={{height:"180px", display:'flex', justifyContent:"center", alignItems:"center",fontWeight:"bold", fontSize:'15px',marginBottom:"27px"}}>No scores to show at the moment</Typography.Paragraph>}
            </Card>
        </div>
    )
}

export default QuestionScoreContainer