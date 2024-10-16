'use client';

import { useState, useContext, createContext, useEffect } from 'react';
import { DialogueModel, UserInterviewModel } from '../models/entities';
import { PrivateRestService } from '../services/client-side/api-services/private-rest-service';
import { InterviewQuestionService } from '../services/client-side/interview-question-service';
import { UserInterviewStatus } from '../models/enum';
import { AzureAIClientService } from '../services/client-side/azure-ai-client-service';

export interface InterviewContextType {
    activeUserInterview?: UserInterviewModel,
    setActiveUserInterview?: React.Dispatch<React.SetStateAction<UserInterviewModel | undefined>>,
    ongoingDialog?: DialogueModel,
    setOngoingDialog?: React.Dispatch<React.SetStateAction<DialogueModel | undefined>>,
    ongoingText?: string,
    setOngoingText?: React.Dispatch<React.SetStateAction<string | undefined>>,
    interviewQuestionService?: InterviewQuestionService
}

const InterviewContext = createContext<InterviewContextType>({});

export const InterviewContextProvider: React.FC<any> = ({ children }) => {
    const [ongoingDialog, setOngoingDialog] = useState<DialogueModel>();
    const [ongoingText, setOngoingText] = useState<string | undefined>("");
    const [activeUserInterview, setActiveUserInterview] = useState<UserInterviewModel>();
    const [interviewQuestionService, setInterviewQuestionService] = useState<InterviewQuestionService>();

    const privateService = new PrivateRestService();
    const azureAIService = new AzureAIClientService();

    useEffect(() => {
        const currentPath = window.location.href
        if (currentPath.includes('/interview/')) {
            const splits = currentPath.split('/');
            const userInterviewId = splits[splits.indexOf('interview') + 1];
            if (userInterviewId) {
                console.log("Setting active user interview as:", userInterviewId)
                privateService.getUserInterviewById({ userInterviewId }).then((userInterview) => {
                    setActiveUserInterview(userInterview)
                    const service = new InterviewQuestionService(userInterview);
                    setInterviewQuestionService(service)
                })
            }
        }
    }, [])

    useEffect(() => {
        const onInitializedStatus = async (activeUserInterview: UserInterviewModel) => {
            const organizedRes = await privateService.organizeInterviewPrompts({ userInterviewId: activeUserInterview._id })
            console.log("Organized response: ", organizedRes)
        }
        switch (activeUserInterview?.status) {
            case UserInterviewStatus.INITIALIZED:
                onInitializedStatus(activeUserInterview);
                break;
        }
    }, [activeUserInterview?.status])

    useEffect(() => {
        if (ongoingDialog?._id && ongoingDialog?.text) {
            privateService.updateUserDialogue({ dialogueId: ongoingDialog._id, text: ongoingDialog.text })
            console.log("Ongoing dialog updated.", ongoingDialog)
        }
    }, [ongoingDialog])

    return (
        <InterviewContext.Provider value={{
            ongoingDialog,
            setOngoingDialog,
            activeUserInterview,
            setActiveUserInterview,
            ongoingText,
            setOngoingText,
            interviewQuestionService
        }}>
            {children}
        </InterviewContext.Provider>
    );
};

export const useInterviewContext = () => useContext(InterviewContext);
