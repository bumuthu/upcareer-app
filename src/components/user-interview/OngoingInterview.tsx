'use client'

import React, { useEffect, useState } from 'react'
import { PrivateRestService } from '../../services/client-side/api-services/private-rest-service'
import { AzureAIClientService } from '../../services/client-side/azure-ai-client-service'
import { useInterviewContext } from '../../context/InterviewContext'
import { ExitIcon } from '../../icons/ExitIcon'
import { StopIcon } from '../../icons/StopIcon'
import { MicIcon } from '../../icons/MicIcon'
import Paragraph from 'antd/es/typography/Paragraph'


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
                display: 'flex',
                justifyContent: 'center',
            }}>
                <Paragraph style={{ backgroundColor: 'black', color: 'white', padding: '5px 10px', borderRadius: '10px' }}>
                    {interviewContext.ongoingDialog ? interviewContext.ongoingDialog?.text + interviewContext.ongoingText : 'Nothing'}
                </Paragraph>
            </div>
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
                <div style={{
                    border: 'none',
                    width: '90px',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}>
                </div>

                <div style={{
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}>
                    <div className="hover-box" onClick={() => setMicOn(!micOn)}>
                        {
                            micOn ?
                                <StopIcon /> :
                                <MicIcon />
                        }
                    </div>
                </div>

                <div style={{
                    border: 'none',
                    padding: '10px 20px',
                    marginRight: '50px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}>
                    <div className="hover-box">
                        <ExitIcon />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default OngoingUserInterview;