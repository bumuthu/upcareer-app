'use client'

import React, { useEffect, useState } from 'react'
import { PrivateRestService } from '@/services/client-side/api-services/private-rest-service'
import { AzureAIClientService } from '../../../../services/client-side/azure-ai-client-service';
import { Switch } from 'antd';
import { useInterviewContext } from '../../../../context/InterviewContext';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';

const UserInterviewPage = () => {
    const [micOn, setMicOn] = useState<boolean>(false);
    const privateRestService = new PrivateRestService()
    const speechService = new AzureAIClientService();
    const interviewContext = useInterviewContext();

    useEffect(() => {
        if (micOn) {
            interviewContext.setOngoingDialog!({
                text: "", userInterview: interviewContext.activeUserInterview?._id, createdAt: Date.now()
            });
            createUserPrompt().then(res => {
                interviewContext.setOngoingDialog!(res);
            })

            speechService.startSpeechToText()
        } else {
            speechService.stopSpeechToText()
            interviewContext.setOngoingDialog!(undefined);
        }
    }, [micOn])

    const createUserPrompt = async () => {
        try {
            const userPromptResponse = await privateRestService.createUserDialogue({
                text: "", userInterviewId: interviewContext.activeUserInterview?._id,
            });
            console.log("UserPrompt:  ", userPromptResponse)
            return userPromptResponse;
        } catch (error) {
            console.log("Error fetching userInterview: ", error)
        }
    }

    return (
        <div style={{ maxWidth: '1200px', width: '75%', margin: '100px auto' }}>
            <Title>Turn mic on/off mic with toggle</Title>
            <Switch style={{ marginTop: "20px", marginBottom: "50px" }} checked={micOn} onChange={() => setMicOn(!micOn)} />

            <Paragraph>
                {interviewContext.ongoingDialog ? interviewContext.ongoingDialog?.text + interviewContext.ongoingText : 'Nothing'}
            </Paragraph>
        </div>
    )
}

export default UserInterviewPage