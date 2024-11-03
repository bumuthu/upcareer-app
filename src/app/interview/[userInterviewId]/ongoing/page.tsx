'use client'

import React from 'react'
import OngoingUserInterview from '../../../../components/user-interview/OngoingInterview';
import WithoutTopNavBar from '../../../../components/layouts/WithoutTopNavBar';

const UserInterviewPage = () => {

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