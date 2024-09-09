'use client'

import { PublicGrid } from '@/components/home/PublicGrid'
import React from 'react'
import { WithTopNavBarLayout } from '@/components/layout/WithTopNavBarLayout'

const Public: React.FC = () => {
  return (
    <main >
      <WithTopNavBarLayout>
        <div className="flex min-h-screen flex-col items-center justify-between p-12">
          <PublicGrid/>
        </div>
      </WithTopNavBarLayout>
    </main>
  )
}

export default Public;
