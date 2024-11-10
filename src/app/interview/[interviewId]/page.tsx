'use client'
import WithTopNavBar from '@/components/layouts/WithTopNavBar'
import UserInterviewContainer from '@/components/user-interview/UserInterviewContainer'
import { useParams } from 'next/navigation'

import React, { useEffect } from 'react'
import { useInterviewContext } from '../../../context/InterviewContext'

const UserInterviewPage = () => {
    const params = useParams()
    const interviewContext = useInterviewContext();
    
    useEffect(() => {
        interviewContext.setInterviewId!(params.interviewId as string)
    }, [params.interviewId])
    
    return (
        <WithTopNavBar>
            <div style={{ maxWidth: '1500px', width: '100%', margin: '100px auto' }}>
                <UserInterviewContainer userInterview={interviewContext.activeUserInterview!} />
            </div>
        </WithTopNavBar>
    )
}

export default UserInterviewPage