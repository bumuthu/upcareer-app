'use client'
import { PrivateRestService } from '@/services/client-side/api-services/private-rest-service'

import React, { useEffect } from 'react'

const UserInterviewPage = () => {
    useEffect(() => {
        createUserPrompt()
    }, [])

    const createUserPrompt = async () => {
        try {
            const privateRestService = new PrivateRestService()
            const userPromptResponse = await privateRestService.createUserPrompt({ promptId: "1234" });
            console.log("UserPrompt:  ", userPromptResponse)
        }
        catch (error) {
            console.log("Error fetching userInterview: ", error)
        }
    }
    return (
        <div style={{ maxWidth: '1200px', width: '75%', margin: '100px auto' }}>
            Hello!
        </div>
    )
}

export default UserInterviewPage