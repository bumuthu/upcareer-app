'use client';

import { useState, useContext, createContext, useEffect } from 'react';
import { DialogueModel, UserInterviewModel } from '../models/entities';
import { PrivateRestService } from '../services/client-side/api-services/private-rest-service';
import { InterviewNodeService } from '../services/client-side/interview-node-service';
import { UserInterviewStatus } from '../models/enum';

export interface InterviewContextType {
    activeUserInterview?: UserInterviewModel,
    setActiveUserInterview?: React.Dispatch<React.SetStateAction<UserInterviewModel | undefined>>,
    ongoingUserDialogue?: DialogueModel,
    setOngoingUserDialogue?: React.Dispatch<React.SetStateAction<DialogueModel | undefined>>,
    ongoingSystemDialogue?: DialogueModel,
    setOngoingSystemDialogue?: React.Dispatch<React.SetStateAction<DialogueModel | undefined>>,
    ongoingText?: string,
    setOngoingText?: React.Dispatch<React.SetStateAction<string | undefined>>,
    interviewNodeService?: InterviewNodeService
}

const InterviewContext = createContext<InterviewContextType>({});

export const InterviewContextProvider: React.FC<any> = ({ children }) => {
    const [ongoingUserDialogue, setOngoingUserDialogue] = useState<DialogueModel>();
    const [ongoingSystemDialogue, setOngoingSystemDialogue] = useState<DialogueModel>();
    const [ongoingText, setOngoingText] = useState<string | undefined>("");
    const [activeUserInterview, setActiveUserInterview] = useState<UserInterviewModel>();
    const [interviewNodeService, setInterviewNodeService] = useState<InterviewNodeService>();

    const privateService = new PrivateRestService();

    useEffect(() => {
        const currentPath = window?.location?.href;
        if (currentPath.includes('/interview/')) {
            const splits = currentPath.split('/');
            const userInterviewId = splits[splits.indexOf('interview') + 1];
            if (userInterviewId) {
                console.log("Setting active user interview as:", userInterviewId)
                privateService.getUserInterviewById({ userInterviewId }).then((userInterview) => {
                    setActiveUserInterview(userInterview)
                })
            }
        }
    }, [])

    useEffect(() => {
        if (!interviewNodeService && activeUserInterview) {
            const service = new InterviewNodeService(activeUserInterview);
            setInterviewNodeService(service)
        }
    }, [activeUserInterview])

    useEffect(() => {
        const onOrganizingStatus = async () => {
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
            if (ongoingUserDialogue && ongoingUserDialogue?._id == undefined) {
                const dialogueRes = await privateService.createDialogue({ text: "", userInterviewId: activeUserInterview?._id, parentDialogueId: ongoingUserDialogue.parentDialogue as string })
                setOngoingUserDialogue(dialogueRes);
            }
            if (ongoingUserDialogue?._id && ongoingUserDialogue?.text) {
                privateService.updateDialogue({ dialogueId: ongoingUserDialogue._id, text: ongoingUserDialogue.text })
            }
        }
        syncDialogue();
    }, [ongoingUserDialogue])

    return (
        <InterviewContext.Provider value={{
            ongoingUserDialogue,
            setOngoingUserDialogue,
            ongoingSystemDialogue,
            setOngoingSystemDialogue,
            activeUserInterview,
            setActiveUserInterview,
            ongoingText,
            setOngoingText,
            interviewNodeService
        }}>
            {children}
        </InterviewContext.Provider>
    );
};

export const useInterviewContext = () => useContext(InterviewContext);
