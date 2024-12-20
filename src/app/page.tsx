'use client'

import React, { Suspense, useEffect, useState } from 'react'
import WithTopNavBar from '../components/layouts/WithTopNavBar';
import BaseInterviewGrid from '../components/base-interviews/BaseInterviewGrid';
import { PublicRestService } from '../services/client-side/api-services/public-rest-service';

import { BaseInterviewModel } from '../models/entities';
import LeftNavBar from '@/components/layouts/LeftNavBar';
const Home: React.FC = () => {
  const [baseInterviews, setBaseInterviews] = useState<BaseInterviewModel[]>([])
  const publicService = new PublicRestService();

  useEffect(() => {
    const queryBaseInterviews = async () => {
      const baseInterviewRes = await publicService.queryBaseInterviews({})
      setBaseInterviews(baseInterviewRes)
    }
    queryBaseInterviews()
  }, [])
  return (
    <main >
      <WithTopNavBar>
        <LeftNavBar>
        <div style={{ maxWidth: '1200px', margin: '100px auto' }}>
          <Suspense>
          <BaseInterviewGrid baseInterviews={baseInterviews}/>
          </Suspense>
        </div>
        </LeftNavBar>
      </WithTopNavBar>
    </main>
  )
}

export default Home;
