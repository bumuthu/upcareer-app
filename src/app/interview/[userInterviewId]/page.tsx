'use client'
import WithTopNavBar from '@/components/layouts/WithTopNavBar'
import UserInterviewContainer from '@/components/user-interview/UserInterviewContainer'
import { UserInterviewModel } from '@/models/entities'
import { PrivateRestService } from '@/services/client-side/api-services/private-rest-service'
import { useParams } from 'next/navigation'

import React, { useEffect, useState } from 'react'

const UserInterviewPage = () => {
    const params = useParams()
    const [userInterview, setUserInterview] = useState<UserInterviewModel>()
    useEffect(() => {
        fetchInterviewData()
    }, [])

    const fetchInterviewData = async () => {
        try {
            const privateRestService = new PrivateRestService()
            console.log("Params ID: ", params.userInterviewId)
            const getUserInterview = await privateRestService.getUserInterviewById({ userInterviewId: params.userInterviewId as string })
            console.log("UserInterview:  ", getUserInterview)
            setUserInterview!(getUserInterview)
        }
        catch (error) {
            console.log("Error fetching userInterview: ", error)
        }
    }
    return (
        <WithTopNavBar>
            <div style={{ maxWidth: '1200px', width: '75%', margin: '100px auto' }}>
                <UserInterviewContainer userInterview={userInterview!} />
            </div>
        </WithTopNavBar>
    )
}

export default UserInterviewPage