import { useInterviewContext } from '@/context/InterviewContext'
import { Card, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { FormattedTreeData } from '../../services/client-side/interview-node-service'

const DialogueContainer = () => {
  const interviewContext = useInterviewContext()
  const [treeNode, setTreeNode] = useState<FormattedTreeData>();

  useEffect(() => {
    setTreeNode(interviewContext.interviewNodeService?.formatTree().find(item => item.id === interviewContext.selectedCardId));
  }, [interviewContext.interviewNodeService])

  return (
    <>
      <Card style={{ width: "100%" }}>
        <Typography.Title level={4} style={{ marginBottom: "25px", marginLeft: "50px" }}>{treeNode?.node.question}</Typography.Title>
        {/* your answer */}
        <Card bordered style={{ border: "solid 1px", marginLeft: "50px", borderColor: "#0D99FF", display: "flex", alignItems: "center" }}>
          <Typography.Title level={5}>Your Answer</Typography.Title>
          <Typography.Paragraph >{treeNode?.node.userAnswer ?? 'No Answer Provided'}</Typography.Paragraph>
        </Card>
        {/* Expected answer */}
        <Card bordered style={{ border: "solid 1px", marginLeft: "50px", borderColor: "black", marginTop: "20px", display: "flex", alignItems: "center" }}>
          <Typography.Title level={5}>Expected Answer</Typography.Title>
          <Typography.Paragraph>{treeNode?.node.expectedAnswer ?? "No Expected Answer"}</Typography.Paragraph>
        </Card>

      </Card>
    </>
  )
}

export default DialogueContainer