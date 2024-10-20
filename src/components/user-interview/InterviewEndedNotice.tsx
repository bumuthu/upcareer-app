'use client'

import { Typography } from 'antd';
import React from 'react'

const InterviewEndedNotice = () => {

    return (
        <div style={{
            width: '100%',
            display: 'flex',
            height: "400px",
            paddingTop: "100px",
            justifyContent: 'center',
        }}>
            <Typography style={{ fontSize: 32, fontWeight: 600 }}>
                The interview has been ended. How was it?
            </Typography>
        </div>
    )
}

export default InterviewEndedNotice;