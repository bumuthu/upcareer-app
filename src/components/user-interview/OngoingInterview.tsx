'use client'

import React, { useEffect, useState } from 'react'
import { PrivateRestService } from '../../services/client-side/api-services/private-rest-service'
import { AzureAIClientService } from '../../services/client-side/azure-ai-client-service'
import { useInterviewContext } from '../../context/InterviewContext'
import { ExitIcon } from '../../icons/ExitIcon'
import { StopIcon } from '../../icons/StopIcon'
import { MicIcon } from '../../icons/MicIcon'
import Paragraph from 'antd/es/typography/Paragraph'
import { ClipLoader } from 'react-spinners'
import { UserInterviewStatus } from '../../models/enum'
import { Modal, Typography } from 'antd'
import { useRouter } from 'next/navigation'
import { getTimingInMinSec } from '../../utils/utils'
import OngoingAudioPlayer from './OngoingAudioPlayer'

const countDownLimit: number = 10;

interface OngoingUserInterviewProps {
}

const OngoingUserInterview = (props: OngoingUserInterviewProps) => {
    const [micOn, setMicOn] = useState<boolean>(false);
    const [speakerOn, setSpeakerOn] = useState<boolean>(false);
    const [countDown, setCountDown] = useState<number | null>(null);
    const [ongoingTimer, setOngoingTimer] = useState<string>();
    const [exitOpen, setExitOpen] = useState<boolean>(false);
    const [exitLoading, setExitLoading] = useState<boolean>(false);
    const [textToSpeech, setTextToSpeech] = useState<string>("")
    const [loadingNodes, setLoadingNodes] = useState<boolean>(false);
    const privateRestService = new PrivateRestService()
    const speechService = new AzureAIClientService();
    const interviewContext = useInterviewContext();
    const router = useRouter();
    let countDownTimer: NodeJS.Timeout;

    useEffect(() => {
        if (countDown == null) return;
        if (countDown > 0) {
            countDownTimer = setTimeout(() => setCountDown(countDown - 1), 1000);
            return () => clearTimeout(countDownTimer);
        } else {
            startInterview()
        }
    }, [countDown]);

    useEffect(() => {
        const onOrganizingStatus = () => {
            setCountDown(countDownLimit);
        }

        const onOngoingStatus = () => {
            setInterval(() => {
                setOngoingTimer(getTimingInMinSec(interviewContext.activeUserInterview?.startedAt!))
            }, 1000);
            if (interviewContext.interviewNodeService) {
                setTextToSpeech(interviewContext.interviewNodeService?.getCurrentNode()?.question!)
                setSpeakerOn(true)
            }
        }
        
        switch (interviewContext.activeUserInterview?.status) {
            case UserInterviewStatus.ORGANIZING:
                onOrganizingStatus();
                break;
                case UserInterviewStatus.ONGOING:
                onOngoingStatus();
                break;
            default:
                break;
        }
    }, [interviewContext.activeUserInterview?.status, interviewContext.interviewNodeService])

    const awaitForInitialNodes = async () => {
        while (Object.keys(interviewContext.interviewNodeService?.getAllNodes() ?? {}).length == 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    const startInterview = async () => {
        setLoadingNodes(true);
        await awaitForInitialNodes();

        const activeUserInterview = await privateRestService.updateUserInterview({
            userInterviewId: interviewContext.activeUserInterview?._id,
            startedAt: Date.now(),
            status: UserInterviewStatus.ONGOING
        });
        setLoadingNodes(false);
        interviewContext.setActiveUserInterview!(activeUserInterview);
    }

    const handleMicEvent = (value: boolean) => {
        if (value) { // Mic ON
            speechService.startSpeechToText();
            interviewContext.handleQuestionRequest!();
        } else { // Mic OFF
            speechService.stopSpeechToText()
            interviewContext.handleUserAnswer!().then(res => {
                setTextToSpeech(interviewContext.interviewNodeService?.getCurrentNode()?.question!)
                setSpeakerOn(true)
            })
        }
        setMicOn(value);
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
                                    {
                                        ongoingTimer && <div style={{
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
                                    }
                                </div> :
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginTop: '35vh',
                                }}>
                                    {
                                        loadingNodes ?
                                            <div>
                                                <ClipLoader
                                                    loading={true}
                                                    size={50}
                                                />
                                            </div> :
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                flexDirection: 'column',
                                            }}>
                                                <Typography style={{ fontSize: '16px', width: '100%', textAlign: 'center' }}>
                                                    This interview starts in
                                                </Typography>
                                                <Typography style={{ fontSize: '100px', fontWeight: 'bold', width: '100%', textAlign: 'center' }}>
                                                    {countDown}
                                                </Typography>
                                            </div>

                                    }
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
                                ((interviewContext.ongoingDialogue && interviewContext.ongoingDialogue?.userAnswer) || interviewContext.ongoingText) &&
                                <Paragraph style={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    padding: '5px 10px',
                                    borderRadius: '10px',
                                    textAlign: 'center',
                                    fontSize: '18px',
                                }}>
                                    {interviewContext.ongoingDialogue ?
                                        interviewContext.ongoingDialogue?.userAnswer ?? "" + interviewContext.ongoingText :
                                        interviewContext.ongoingText}
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
                        <OngoingAudioPlayer text={textToSpeech} start={speakerOn} onComplete={() => { setSpeakerOn(false) }} />
                    </div>
                </>
                : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><ClipLoader /></div>}
        </div>
    )

}

export default OngoingUserInterview;