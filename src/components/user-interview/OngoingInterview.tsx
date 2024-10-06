'use client'

import { Switch } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'
import React, { useEffect, useState } from 'react'
import { PrivateRestService } from '../../services/client-side/api-services/private-rest-service'
import { AzureAIClientService } from '../../services/client-side/azure-ai-client-service'
import { useInterviewContext } from '../../context/InterviewContext'


interface OngoingUserInterviewProps {

}

const OngoingUserInterview = (props: OngoingUserInterviewProps) => {
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
        <div style={{
            width: '100%',
            height: 'calc(100vh - 20px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
        }}>
            <div style={{
                width: '100%',
                height: '200px',
                position: 'relative',
                bottom: '0',
                left: '0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <button style={{
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}>
                    Left
                </button>

                <div style={{
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}>
                    <Switch style={{ marginTop: "20px", marginBottom: "50px" }} checked={micOn} onChange={() => setMicOn(!micOn)} />
                    <Paragraph>
                        {interviewContext.ongoingDialog ? interviewContext.ongoingDialog?.text + interviewContext.ongoingText : 'Nothing'}
                    </Paragraph>
                </div>

                <button style={{
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}>
                    Exit
                </button>
            </div>
        </div>

        // <div style={{
        //     width: '100%',
        //     height: 'calc(100vh - 20px)',
        //     borderRadius: '5px',
        //     display: 'flex',
        //     flexDirection: 'column',
        //     justifyContent: 'flex-end',
        // }}>
        //     <div style={{
        //         width: '100%',
        //         height: '100px',  // Adjust the height as needed
        //         position: 'relative',
        //         bottom: '0',
        //         left: '0',
        //     }}>
        //         <div>
        //         <Switch style={{ marginTop: "20px", marginBottom: "50px" }} checked={micOn} onChange={() => setMicOn(!micOn)} />
        //         <Paragraph>
        //             {interviewContext.ongoingDialog ? interviewContext.ongoingDialog?.text + interviewContext.ongoingText : 'Nothing'}
        //         </Paragraph>
        //         </div>
        //     </div>
        // </div>
    )

}

export default OngoingUserInterview;