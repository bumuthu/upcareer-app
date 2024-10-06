'use client'

import React, { useEffect, useState } from 'react'
import OngoingUserInterview from '../../../../components/user-interview/OngoingInterview';

const UserInterviewPage = () => {

    return (
        <div style={{
            backgroundColor: '#E9E9E9',
            width: '100%',
            height: 'calc(100vh - 20px)',
            borderRadius: '5px'
        }}>
            <OngoingUserInterview />
        </div>
    )
}

export default UserInterviewPage