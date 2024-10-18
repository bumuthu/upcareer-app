"use client"
import LeftNavBar from '@/components/layouts/LeftNavBar'
import WithTopNavBar from '@/components/layouts/WithTopNavBar'
import SettingsTabs from '@/components/settings/SettingsTabs'
import React, { Suspense } from 'react'

const MyAccountPage = () => {
    return (
        <WithTopNavBar>
            <LeftNavBar>
                <div style={{ maxWidth: '1200px', margin: '100px auto' }}>
                    <Suspense>
                        <SettingsTabs />
                    </Suspense>
                </div>
            </LeftNavBar>
        </WithTopNavBar>
    )
}

export default MyAccountPage