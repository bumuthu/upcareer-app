"use client"
import LeftNavBar from '@/components/layouts/LeftNavBar'
import WithTopNavBar from '@/components/layouts/WithTopNavBar'
import React from 'react'

const MyAccountPage = () => {
    return (
        <WithTopNavBar>
            <LeftNavBar>
                <div style={{marginTop:"100px"}}><h1>MyAccountPage</h1></div>
            </LeftNavBar>
        </WithTopNavBar>
    )
}

export default MyAccountPage