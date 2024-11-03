'use client'

import React, { useEffect } from 'react'
import OngoingUserInterview from '../../../../components/user-interview/OngoingInterview';
import WithoutTopNavBar from '../../../../components/layouts/WithoutTopNavBar';
import { useParams } from 'next/navigation';
import { useInterviewContext } from '../../../../context/InterviewContext';

const UserInterviewPage = () => {
    const params = useParams()
    const interviewContext = useInterviewContext();

    useEffect(() => {
        interviewContext.setInterviewId!(params.interviewId as string)
    }, [params.interviewId])
    
    return (
        <WithoutTopNavBar>
            <div style={{
                backgroundColor: '#E9E9E9',
                width: '100%',
                height: 'calc(100vh - 20px)',
                borderRadius: '5px'
            }}>
                <OngoingUserInterview />
            </div>
        </WithoutTopNavBar>
    )
}

export default UserInterviewPage