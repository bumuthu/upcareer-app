'use client'

import React, { useEffect, useState } from 'react'
import { VisualizerStatus } from './OngoingInterview'
import { Typography } from 'antd'

interface OngoingSpeechVisualizerProps {
    status: VisualizerStatus
}
const OngoingSpeechVisualizer = (props: OngoingSpeechVisualizerProps) => {
    return <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    }}>
        <Typography>
            {props.status}
        </Typography>
    </div>
}

export default OngoingSpeechVisualizer;