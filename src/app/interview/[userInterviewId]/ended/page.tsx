'use client'

import React from 'react'
import InterviewEndedNotice from '../../../../components/user-interview/InterviewEndedNotice'
import WithoutTopNavBar from '../../../../components/layouts/WithoutTopNavBar'

const InterviewEndedPage = () => {

    return (
        <WithoutTopNavBar>
            <div style={{
                backgroundColor: '#E9E9E9',
                width: '100%',
                height: 'calc(100vh - 20px)',
                borderRadius: '5px'
            }}>
                <InterviewEndedNotice />
            </div>
        </WithoutTopNavBar>
    )
}

export default InterviewEndedPage