'use client'

import React, { useEffect, useState } from 'react'
import { useInterviewContext } from '../../context/InterviewContext';
import { FormattedTreeData } from '../../services/client-side/interview-node-service';

const SingleInterviewAnalysis = () => {
    const [questionTree, setQuestionTree] = useState<FormattedTreeData[]>();
    const interviewContext = useInterviewContext();

    useEffect(() => {
        console.log("Question Tree", questionTree)
    }, [questionTree]);

    useEffect(() => {
        if (interviewContext.interviewNodeService) {
            setQuestionTree(interviewContext.interviewNodeService!.formatTree())
        }
    }, [interviewContext.interviewNodeService])

    return (
        <div>
        </div>
    )
}

export default SingleInterviewAnalysis;