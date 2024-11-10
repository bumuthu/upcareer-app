'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { PrivateRestService } from '../../services/client-side/api-services/private-rest-service'
import { AzureAIClientService } from '../../services/client-side/azure-ai-client-service'
import { useInterviewContext } from '../../context/InterviewContext'
import { ExitIcon } from '../../icons/ExitIcon'
import { StopIcon } from '../../icons/StopIcon'
import { MicIcon } from '../../icons/MicIcon'
import Paragraph from 'antd/es/typography/Paragraph'
import { ClipLoader } from 'react-spinners'
import { EndingReason, UserInterviewStatus } from '../../models/enum'
import { Modal, Typography } from 'antd'
import { useRouter } from 'next/navigation'
import { getSecondsDifference, getTimingInMinSec } from '../../utils/utils'
import OngoingAudioPlayer from './OngoingAudioPlayer'
import OngoingSpeechVisualizer from './OngoingSpeechVisualizer'
import { generateClosingMessage, generateReminderMessage } from '../../utils/prompts'

const countDownLimit: number = 10;
const idleTimeout: number = 9000;
const reminderTimeout: number = 30;

export enum VisualizerStatus {
    IDLE = "Idle", // nothing to display
    THINKING = "Thinking", // while processing
    SPEAKING = "Speaking", // while AI is speaking
    LISTENING = "Listening", // while AI is listening
}

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
    const [visualizerStatus, setVisualizerStatus] = useState<VisualizerStatus>(VisualizerStatus.IDLE);
    const [idleTimer, setIdleTimer] = useState<number>();
    const privateRestService = new PrivateRestService()
    const speechService = new AzureAIClientService();
    const interviewContext = useInterviewContext();
    const router = useRouter();
    let countDownTimer: NodeJS.Timeout;

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true }); // Request audio permissions when refreshing
    }, []) 

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
            case UserInterviewStatus.CANCELLED:
                router.push(`/interview/${interviewContext.activeUserInterview?._id}/ended`);
                break;
            case UserInterviewStatus.COMPLETED:
                router.push(`/interview/${interviewContext.activeUserInterview?._id}/ended`);
                break;
            default:
                break;
        }
    }, [interviewContext.activeUserInterview?.status, interviewContext.interviewNodeService])

    useEffect(() => {
        const onIdleStart = async () => {
            if (!interviewContext.activeUserInterview) return;
            setIdleTimer(Date.now());
            let timedOut, shouldBreak, reminderGave = false;

            while (true) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setIdleTimer(prevIdleTimer => {
                    if (!prevIdleTimer) {
                        shouldBreak = true;
                        return prevIdleTimer;
                    }
                    if (!reminderGave && getSecondsDifference(prevIdleTimer!) > reminderTimeout) {
                        setTextToSpeech(generateReminderMessage() + interviewContext.interviewNodeService?.getCurrentNode()?.question)
                        setSpeakerOn(true)
                        reminderGave = true;
                    }
                    timedOut = getSecondsDifference(prevIdleTimer!) > idleTimeout;
                    if (timedOut) {
                        setTextToSpeech(generateClosingMessage())
                        setSpeakerOn(true)
                        shouldBreak = true;
                    }
                    return prevIdleTimer;
                })
                if (shouldBreak) break;
            }
            if (timedOut) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                await privateRestService.updateUserInterview({
                    userInterviewId: interviewContext.activeUserInterview?._id,
                    endedAt: Date.now(),
                    status: UserInterviewStatus.CANCELLED
                });
                router.push(`/interview/${interviewContext.activeUserInterview?._id}/ended`);
            }
        }

        switch (visualizerStatus) {
            case VisualizerStatus.IDLE:
                onIdleStart();
                break;
            default:
                setIdleTimer(undefined);
                break;
        }
    }, [visualizerStatus, interviewContext.activeUserInterview])

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
            setVisualizerStatus(VisualizerStatus.LISTENING);
        } else { // Mic OFF
            speechService.stopSpeechToText()
            setVisualizerStatus(VisualizerStatus.THINKING);
            interviewContext.handleUserAnswer!().then(res => {
                const nextSpeech = (interviewContext.interviewNodeService?.getCurrentNode()?.previousAnswerFeedback ?? "") + " " +
                    interviewContext.interviewNodeService?.getCurrentNode()?.question;
                setTextToSpeech(nextSpeech)
                setSpeakerOn(true)
                setVisualizerStatus(VisualizerStatus.SPEAKING);
            })
        }
        setMicOn(value);
    }

    const handleExit = async () => {
        setExitLoading(true);
        const updatedUserInterview = await privateRestService.updateUserInterview({
            userInterviewId: interviewContext.activeUserInterview?._id,
            endedAt: Date.now(),
            status: UserInterviewStatus.CANCELLED,
            endingReason: EndingReason.USER_CANCELLED
        });
        interviewContext.setActiveUserInterview!(updatedUserInterview);
        speechService.stopSpeechService();
        setExitLoading(false);
        router.push(`/interview/${interviewContext.activeUserInterview?._id}/ended`);
        setExitOpen(false);
    }

    const onSpeechCompleted = () => { 
        setSpeakerOn(false)
        setVisualizerStatus(VisualizerStatus.IDLE);
        // handleMicEvent(true);
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
                                <div style={{ display: 'flex', width: '100%', flexDirection: 'column', padding: '0px 50px' }}>
                                    <div style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        marginTop: '20px',
                                    }}>
                                        {
                                            ongoingTimer && <div style={{
                                                backgroundColor: 'black',
                                                height: '20px',
                                                padding: '5px 15px',
                                                paddingTop: '10px',
                                                borderRadius: '20px',
                                                color: 'white',
                                                fontSize: '14px',
                                            }}>
                                                <div style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: 'red',
                                                    height: '10px',
                                                    width: '10px',
                                                    display: 'inline-block',
                                                    marginRight: "8px",
                                                }} />
                                                {ongoingTimer}
                                            </div>
                                        }
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems:"center",
                            
                                        marginTop: '10vh',
                                    }}>
                                        <OngoingSpeechVisualizer status={visualizerStatus} />
                                    </div>
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
                            zIndex: 1,
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
                                        (interviewContext.ongoingDialogue?.userAnswer ?? "") + interviewContext.ongoingText :
                                        interviewContext.ongoingText}
                                </Paragraph>
                            }
                        </div>
                        <div style={{
                            width: '100%',
                            height: '100px',
                            marginBottom: '50px',
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
                        <OngoingAudioPlayer text={textToSpeech} start={speakerOn} onComplete={onSpeechCompleted} />
                    </div>
                </>
                : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><ClipLoader /></div>}
        </div>
    )

}

export default OngoingUserInterview;