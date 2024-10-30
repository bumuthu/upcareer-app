"use client";

import React, { useEffect, useState } from 'react'
import WithTopNavBar from '../../../components/layouts/WithTopNavBar';
import LeftNavBar from '../../../components/layouts/LeftNavBar';
import SingleInterviewAnalysis from '../../../components/interview-analysis/SingleInterviewAnalysis';
import { useParams } from 'next/navigation';

const MyInterview = () => {
    const params = useParams()
    console.log("Interview Id: ", params.interviewId)
   
   return <WithTopNavBar>
        <LeftNavBar>
            <div style={{ maxWidth: '1200px', margin: '100px auto' }}>
                <SingleInterviewAnalysis />
            </div>
        </LeftNavBar>
    </WithTopNavBar>
}

export default MyInterview;