'use client'

import React, { useEffect, useState } from 'react'
import { PrivateRestService } from '../../services/client-side/api-services/private-rest-service'
import { AzureAIClientService } from '../../services/client-side/azure-ai-client-service'
import { useInterviewContext } from '../../context/InterviewContext'
import { ExitIcon } from '../../icons/ExitIcon'
import { StopIcon } from '../../icons/StopIcon'
import { MicIcon } from '../../icons/MicIcon'
import Paragraph from 'antd/es/typography/Paragraph'
import Title from 'antd/es/typography/Title'
import { ClipLoader } from 'react-spinners'
import { UserInterviewStatus } from '../../models/enum'
import { Modal } from 'antd'
import { useRouter } from 'next/navigation'
import { getTimingInMinSec } from '../../utils/utils'
import OngoingAudioPlayer from './OngoingAudioPlayer'

interface OngoingUserInterviewProps {
}

const OngoingUserInterview = (props: OngoingUserInterviewProps) => {
    const [micOn, setMicOn] = useState<boolean>(false);
    const [speakerOn, setSpeakerOn] = useState<boolean>(false);
    const [countDown, setCountDown] = useState<number>(10);
    const [ongoingTimer, setOngoingTimer] = useState<string>();
    const [exitOpen, setExitOpen] = useState<boolean>(false);
    const [exitLoading, setExitLoading] = useState<boolean>(false);
    const [tempLastText, setTempLastTest] = useState<string>("")
    const privateRestService = new PrivateRestService()
    const speechService = new AzureAIClientService();
    const interviewContext = useInterviewContext();
    const router = useRouter();
    let countDownTimer: any;

    useEffect(() => {
        if (interviewContext.activeUserInterview?.status == UserInterviewStatus.INITIALIZED) {
            if (countDown > 0) {
                countDownTimer = setTimeout(() => setCountDown(countDown - 1), 1000);
                return () => clearTimeout(countDownTimer);
            } else {
                startInterview()
            }
        } else if (interviewContext.activeUserInterview?.status == UserInterviewStatus.ONGOING) {
            setInterval(() => {
                setOngoingTimer(getTimingInMinSec(interviewContext.activeUserInterview?.startedAt!))
            }, 1000);
        } else {
            // TODO: implement a notice that interview is not valid
        }
    }, [interviewContext.activeUserInterview, countDown]);

    const startInterview = async () => {
        privateRestService.updateUserInterview({
            userInterviewId: interviewContext.activeUserInterview?._id,
            startedAt: Date.now(),
            status: UserInterviewStatus.ONGOING
        }).then((res) => {
            interviewContext.setActiveUserInterview!(res);
        })
    }

    const handleMicEvent = (value: boolean) => {
        if (value) {
            interviewContext.setOngoingDialog!({ text: "", userInterview: interviewContext.activeUserInterview?._id, createdAt: Date.now() });
            createUserPrompt()
            speechService.startSpeechToText()
        } else {
            setTempLastTest(interviewContext.ongoingDialog?.text! + " " + interviewContext.ongoingText!)
            if (interviewContext.ongoingText) {
                interviewContext.setOngoingDialog!((d => {
                    if (d) return { ...d!, text: d.text + " " + interviewContext.ongoingText! }
                    return undefined
                }));
            }
            speechService.stopSpeechToText()
            interviewContext.setOngoingDialog!(undefined);
            setSpeakerOn(true)
        }
        setMicOn(value);
    }

    const createUserPrompt = async () => {
        try {
            const userPromptResponse = await privateRestService.createUserDialogue({
                text: "", userInterviewId: interviewContext.activeUserInterview?._id,
            });
            interviewContext.setOngoingDialog!(userPromptResponse)
            console.log("UserPrompt:  ", userPromptResponse)
            return userPromptResponse;
        } catch (error) {
            console.log("Error fetching userInterview: ", error)
        }
    }

    const handleExit = async () => {
        setExitLoading(true);
        await privateRestService.updateUserInterview({
            userInterviewId: interviewContext.activeUserInterview?._id,
            endedAt: Date.now(),
            status: UserInterviewStatus.CANCELLED
        });
        setExitLoading(false);
        router.push('/my-interviews');
        setExitOpen(false);
    }

    return (
        <div>
            {interviewContext.activeUserInterview ?
                <>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        height: "400px",
                        justifyContent: 'center',
                    }}>
                        {
                            interviewContext.activeUserInterview?.status == UserInterviewStatus.ONGOING ?
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    marginTop: '20px',
                                    marginRight: '50px',
                                }}>
                                    <div style={{
                                        backgroundColor: 'black',
                                        height: '20px',
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        color: 'white',
                                    }}>
                                        <div style={{
                                            borderRadius: "5px",
                                            backgroundColor: 'red',
                                            height: '10px',
                                            width: '10px',
                                            display: 'inline-block',
                                            marginRight: "5px"
                                        }} />
                                        {ongoingTimer}
                                    </div>
                                </div> :
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginTop: '100px',
                                }}>
                                    <Title level={1}>
                                        {countDown}
                                    </Title>
                                </div>
                        }
                    </div>
                    <div style={{
                        width: '100%',
                        height: 'calc(100vh - 420px)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                    }}>
                        <div style={{
                            width: '90%',
                            display: 'flex',
                            margin: "0px auto",
                            justifyContent: 'center',
                        }}>
                            {
                                ((interviewContext.ongoingDialog && interviewContext.ongoingDialog?.text) || interviewContext.ongoingText) &&
                                <Paragraph style={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    padding: '5px 10px',
                                    borderRadius: '10px',
                                    textAlign: 'center',
                                    fontSize: '18px',
                                }}>
                                    {interviewContext.ongoingDialog ? interviewContext.ongoingDialog?.text + interviewContext.ongoingText : interviewContext.ongoingText}
                                </Paragraph>
                            }
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
                                <div className="hover-box" onClick={() => handleMicEvent(!micOn)}>
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
                                <div className="hover-box" onClick={() => setExitOpen(true)}>
                                    <ExitIcon />
                                </div>
                                <Modal title="Are you sure you want to exit the interview?" open={exitOpen} okText="Exit" onOk={handleExit} okButtonProps={{ danger: true, loading: exitLoading }} onCancel={() => setExitOpen(false)} closable={false}>
                                    <p>When you exit the interview, your interview can nolonger be continued. Are you sure that you want to close the interview?</p>
                                </Modal>
                            </div>
                        </div>
                        <OngoingAudioPlayer text={tempLastText} start={speakerOn} onComplete={() => { setSpeakerOn(false)}}/>
                    </div>
                </>
                : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><ClipLoader /></div>}
        </div>
    )

}

export default OngoingUserInterview;