'use client'

import React from 'react'
import InterviewEndedNotice from '../../../../components/user-interview/InterviewEndedNotice'

const InterviewEndedPage = () => {

    return (
        <div style={{
            backgroundColor: '#E9E9E9',
            width: '100%',
            height: 'calc(100vh - 20px)',
            borderRadius: '5px'
        }}>
            <InterviewEndedNotice/>
        </div>
    )
}

export default InterviewEndedPage