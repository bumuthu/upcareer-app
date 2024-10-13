"use client"
import LeftNavBar from '@/components/layouts/LeftNavBar'
import WithTopNavBar from '@/components/layouts/WithTopNavBar'
import MyInterviewGrid from '@/components/my-interviews/MyInterviewGrid'
import { UserInterviewModel } from '@/models/entities'
import { PrivateRestService } from '@/services/client-side/api-services/private-rest-service'
import React, { useEffect, useState } from 'react'

const MyInterviewPage = () => {
    const [userInterviews, setUserInterviews] = useState<UserInterviewModel[]>([])
const privateRestService = new PrivateRestService()
    useEffect(() => {
        const queryUserInterviews = async () => {
            const userInterviewRes = await privateRestService.getUserInterviews()
            setUserInterviews(userInterviewRes) 
        }
        queryUserInterviews()
    }, [])
    return (
        <WithTopNavBar>
            <LeftNavBar>
                <MyInterviewGrid userInterviews={userInterviews} />
            </LeftNavBar>
        </WithTopNavBar>
    )
}

export default MyInterviewPage