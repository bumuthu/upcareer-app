'use client';

import { useState, useContext, createContext, useEffect } from 'react';
import { DialogueModel, UserInterviewModel } from '../models/entities';
import { PrivateRestService } from '../services/client-side/api-services/private-rest-service';
import { InterviewNodeService } from '../services/client-side/interview-node-service';
import { UserInterviewStatus } from '../models/enum';
import { PullAudioOutputStream } from 'microsoft-cognitiveservices-speech-sdk';
import { currentUrlIncludes } from '../utils/utils';

const mainNodeCount: number = Number(process.env.NEXT_PUBLIC_MAIN_NODES_COUNT || 10);

export interface InterviewContextType {
    activeUserInterview?: UserInterviewModel,
    setActiveUserInterview?: React.Dispatch<React.SetStateAction<UserInterviewModel | undefined>>,
    ongoingDialogue?: DialogueModel,
    setOngoingDialogue?: React.Dispatch<React.SetStateAction<DialogueModel | undefined>>,
    ongoingText?: string,
    setOngoingText?: React.Dispatch<React.SetStateAction<string | undefined>>,
    interviewNodeService?: InterviewNodeService,
    audioSynthesisData?: PullAudioOutputStream | undefined,
    setAudioSynthensisData?: React.Dispatch<React.SetStateAction<PullAudioOutputStream | undefined>>,
    handleUserAnswer?: () => Promise<void>,
    handleQuestionRequest?: () => Promise<void>,
    setInterviewId?: React.Dispatch<React.SetStateAction<string | undefined>>,
}

const InterviewContext = createContext<InterviewContextType>({});

export const InterviewContextProvider: React.FC<any> = ({ children }) => {
    const [ongoingDialogue, setOngoingDialogue] = useState<DialogueModel>();
    const [ongoingText, setOngoingText] = useState<string | undefined>("");
    const [activeUserInterview, setActiveUserInterview] = useState<UserInterviewModel>();
    const [interviewNodeService, setInterviewNodeService] = useState<InterviewNodeService>();
    const [audioSynthesisData, setAudioSynthensisData] = useState<PullAudioOutputStream | undefined>();
    const [interviewId, setInterviewId] = useState<string>();

    const privateService = new PrivateRestService();

    useEffect(() => {
        const setActiveInterview = () => {
            if (interviewId) {
                console.log("Setting active user interview as:", interviewId)
                privateService.getUserInterviewById({ userInterviewId: interviewId }).then((userInterview) => {
                    setActiveUserInterview(userInterview)
                })
            }
        }
        setActiveInterview();
    }, [interviewId])

    useEffect(() => {
        if (!interviewNodeService && activeUserInterview) {
            const service = new InterviewNodeService(activeUserInterview);
            setInterviewNodeService(service)
        }
    }, [activeUserInterview])

    useEffect(() => {
        const onOrganizingStatus = async () => {
            if (Object.keys(interviewNodeService?.getAllNodes() ?? {}).length >= mainNodeCount) {
                return;
            }
            const organizedRes = await privateService.organizeInterviewPrompts({ userInterviewId: activeUserInterview?._id })
            let lastNodeId: string | null = null;
            let firstNodeId: string | null = null;
            for (let node of organizedRes) {
                const currentNodeId = interviewNodeService?.generateNodeId()
                if (!firstNodeId) {
                    firstNodeId = currentNodeId!;
                }
                interviewNodeService?.addNode(lastNodeId, {
                    id: currentNodeId!,
                    isParentNode: true,
                    question: node.question,
                    expectedAnswer: node.answer
                });
                lastNodeId = currentNodeId!
            }
            interviewNodeService?.setCurrentNodeId(firstNodeId!)
            console.log("All nodes:", interviewNodeService?.getAllNodes());
        }

        switch (activeUserInterview?.status) {
            case UserInterviewStatus.ORGANIZING:
                onOrganizingStatus();
                break;
        }
    }, [interviewNodeService, activeUserInterview?.status])

    useEffect(() => {
        const syncDialogue = async () => {
            if (ongoingDialogue && ongoingDialogue?._id == undefined) {
                const dialogueRes = await privateService.createDialogue({ userAnswer: ongoingDialogue.userAnswer, userInterviewId: activeUserInterview?._id, parentDialogueId: ongoingDialogue.parentDialogue as string })
                setOngoingDialogue(dialogueRes);
            }
            if (ongoingDialogue?._id && ongoingDialogue?.userAnswer) {
                privateService.updateDialogue({ dialogueId: ongoingDialogue._id, userAnswer: ongoingDialogue.userAnswer })
            }
        }
        syncDialogue();
    }, [ongoingDialogue]);

    const handleUserAnswer = async () => {
        if (ongoingText) {
            setOngoingDialogue!((d => {
                if (d) return { ...d!, userAnswer: (d.userAnswer ?? "") + " " + ongoingText! }
                return undefined
            }));
        }

        interviewNodeService?.updateCurrentNode({
            ...interviewNodeService?.getCurrentNode(),
            userAnswer: ongoingDialogue?.userAnswer,
            dialogueId: ongoingDialogue?._id
        });
        console.log("Previous node:", interviewNodeService?.getCurrentNode());

        const promptRes = await privateService.promptInterviewAnswer({
            dialogueId: ongoingDialogue?._id,
            userInterviewId: activeUserInterview?._id
        });

        interviewNodeService?.addNode(interviewNodeService.getCurrentNode()?.id, {
            id: interviewNodeService.generateNodeId(),
            isParentNode: false,
            question: promptRes.question,
            previousAnswerFeedback: promptRes.feedback,
            expectedAnswer: promptRes.answer,
            parentNodeId: interviewNodeService.getCurrentNode()?.parentNodeId
        })
        interviewNodeService?.activateNextNode();
        console.log("Next node:", interviewNodeService?.getCurrentNode())

        setOngoingDialogue!(undefined);
    }

    const handleQuestionRequest = async () => {
        setOngoingDialogue!({
            userAnswer: "",
            userInterview: activeUserInterview?._id,
            systemQuestion: interviewNodeService?.getCurrentNode()?.question
        });
    }

    return (
        <InterviewContext.Provider value={{
            audioSynthesisData,
            setAudioSynthensisData,
            ongoingDialogue,
            setOngoingDialogue,
            activeUserInterview,
            setActiveUserInterview,
            ongoingText,
            setOngoingText,
            interviewNodeService,
            handleQuestionRequest,
            handleUserAnswer,
            setInterviewId
        }}>
            {children}
        </InterviewContext.Provider>
    );
};

export const useInterviewContext = () => useContext(InterviewContext);
