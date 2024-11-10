"use client";

import React, { useEffect, useState } from 'react'
import WithTopNavBar from '../../../components/layouts/WithTopNavBar';
import LeftNavBar from '../../../components/layouts/LeftNavBar';
import SingleInterviewAnalysis from '../../../components/interview-analysis/SingleInterviewAnalysis';
import { useParams } from 'next/navigation';
import { useInterviewContext } from '../../../context/InterviewContext';

const MyInterview = () => {
    const params = useParams()
    const interviewContext = useInterviewContext();

    useEffect(() => {
        interviewContext.setInterviewId!(params.interviewId as string)
    }, [params.interviewId])
   
   return <WithTopNavBar>
        <LeftNavBar>
            <div style={{maxWidth:"1500px" ,width:"100%",margin: '100px auto' }}>
                <SingleInterviewAnalysis />
            </div>
        </LeftNavBar>
    </WithTopNavBar>
}

export default MyInterview;