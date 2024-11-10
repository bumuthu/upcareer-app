import { useInterviewContext } from '@/context/InterviewContext'
import { getTrimmedText } from '@/utils/utils'
import { Card, Typography } from 'antd'
import React from 'react'

const DialogueContainer = () => {
  const interviewContext = useInterviewContext()
  const interviewObj = interviewContext.interviewNodeService?.formatTree().find(item => item.id === interviewContext.selectedCardId);
  return (
    <>
      <Card style={{width:"100%"}}>
        <Typography.Title level={4} style={{marginBottom:"25px", height:"50px"}}>{interviewContext.selectedCardId}</Typography.Title>
        {/* your answer */}
        <Card bordered style={{ border: "solid 1px",marginLeft:"50px", borderColor: "#0D99FF", display:"flex", alignItems:"center", height:"200px"}}>
          <Typography.Title level={5}>Your Answer</Typography.Title>
          <Typography.Paragraph >{interviewObj?.node.userAnswer ? getTrimmedText(interviewObj?.node.userAnswer,350): 'No Answer Provided' }</Typography.Paragraph>
        </Card>
        {/* Expected answer */}
        <Card bordered style={{ border: "solid 1px", marginLeft:"50px", borderColor: "black", marginTop:"20px", display:"flex", alignItems:"center", height:"200px"}}>
          <Typography.Title level={5}>Expected Answer</Typography.Title>
          <Typography.Paragraph>{ interviewObj?.node.expectedAnswer? getTrimmedText (interviewObj?.node.expectedAnswer, 350):"No Expected Answer"}</Typography.Paragraph>
        </Card>

      </Card>
    </>
  )
}

export default DialogueContainer