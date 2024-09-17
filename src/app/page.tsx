'use client'

import React, { useEffect } from 'react'
import { PrivateRestService } from '../services/api-services/private-rest-service';

const Home: React.FC = () => {
  const privateService = new PrivateRestService();
  useEffect(() => {
    const users = async () => {
      await privateService.getUser();
    }
    users()
  }, [])
  return (
    <main >
      <div className="flex min-h-screen flex-col items-center justify-between p-12">
        Welcome to UpCareer
      </div>
    </main>
  )
}

export default Home;
