'use client'

import React, { useEffect, useState } from 'react'
import WithTopNavBar from '../components/layouts/WithTopNavBar';
import BaseInterviewGrid from '../components/base-interviews/BaseInterviewGrid';
import { PublicRestService } from '../services/client-side/api-services/public-rest-service';

import { BaseInterviewModel } from '../models/entities';
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
        <div style={{ maxWidth: '1200px', width: '75%', margin: '100px auto' }}>
          <BaseInterviewGrid baseInterviews={baseInterviews}/>
        </div>
      </WithTopNavBar>
    </main>
  )
}

export default Home;
