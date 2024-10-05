'use client';

import { useState, useContext, createContext, useEffect } from 'react';
import { DialogueModel, UserInterviewModel } from '../models/entities';
import { PrivateRestService } from '../services/client-side/api-services/private-rest-service';

export interface InterviewContextType {
    activeUserInterview?: UserInterviewModel,
    setActiveUserInterview?: React.Dispatch<React.SetStateAction<UserInterviewModel | undefined>>,
    ongoingDialog?: DialogueModel,
    setOngoingDialog?: React.Dispatch<React.SetStateAction<DialogueModel | undefined>>,
    ongoingText?: string,
    setOngoingText?: React.Dispatch<React.SetStateAction<string | undefined>>,
}

const InterviewContext = createContext<InterviewContextType>({});

export const InterviewContextProvider: React.FC<any> = ({ children }) => {
    const [ongoingDialog, setOngoingDialog] = useState<DialogueModel>();
    const [ongoingText, setOngoingText] = useState<string | undefined>("");
    const [activeUserInterview, setActiveUserInterview] = useState<UserInterviewModel>();

    const privateService = new PrivateRestService();

    useEffect(() => {
        const currentPath = window.location.href
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
        if (ongoingDialog) {
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
            setOngoingText
        }}>
            {children}
        </InterviewContext.Provider>
    );
};

export const useInterviewContext = () => useContext(InterviewContext);
