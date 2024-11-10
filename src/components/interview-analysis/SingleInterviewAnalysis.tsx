'use client'

import React, { useEffect, useState } from 'react'
import { useInterviewContext } from '../../context/InterviewContext';
import { FormattedTreeData } from '../../services/client-side/interview-node-service';
import LeftContainer from './LeftContainer';
import RightContainer from './RightContainer';
import { useMediaQuery } from 'react-responsive';
import { breakpoints } from '@/common/AppThemeProvider';

const SingleInterviewAnalysis = () => {
    const [questionTree, setQuestionTree] = useState<FormattedTreeData[]>();
    const interviewContext = useInterviewContext();
    const isSmallScreen = useMediaQuery({ maxWidth: breakpoints.xl })
    useEffect(() => {
        console.log("Question Tree", questionTree)
    }, [questionTree]);

    useEffect(() => {
        if (interviewContext.interviewNodeService) {
            setQuestionTree(interviewContext.interviewNodeService!.formatTree())
        }
    }, [interviewContext.interviewNodeService])

    return (
        <div style={{ display: "flex", flexDirection: isSmallScreen ? "column" : "row", gap: "50px", justifyContent: "center", alignItems: "center", width: "100%" }}>
            <LeftContainer />
            <RightContainer />
        </div>
    )
}

export default SingleInterviewAnalysis;