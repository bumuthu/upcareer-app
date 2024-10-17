"use client"
import LeftNavBar from '@/components/layouts/LeftNavBar'
import WithTopNavBar from '@/components/layouts/WithTopNavBar'
import SettingsTabs from '@/components/settings/SettingsTabs'
import React from 'react'

const MyAccountPage = () => {
    return (
        <WithTopNavBar>
            <LeftNavBar>
                <div style={{ maxWidth: '1200px', margin: '100px auto' }}>
                    <SettingsTabs/>
                </div>
            </LeftNavBar>
        </WithTopNavBar>
    )
}

export default MyAccountPage