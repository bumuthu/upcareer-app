import React from 'react'
import OverallScoreContainer from './OverallScoreContainer'
import QuestionScoreContainer from './QuestionScoreContainer'
import DialogueContainer from './DialogueContainer'
import { useMediaQuery } from 'react-responsive'
import { breakpoints } from '@/common/AppThemeProvider'

const RightContainer = () => {
    const isSmallScreen = useMediaQuery({ maxWidth: breakpoints.xl })
    return (
        <div style={{display:"flex", flexDirection: "column", gap:"20px", width:isSmallScreen?"100%":"70%", height:"100vh"}}>
            <div style={{display:"flex", flexDirection:isSmallScreen?"column":"row", gap:"20px", width:"100%"}}>
                <OverallScoreContainer />
                <QuestionScoreContainer />
            </div>
            <div style={{width:"100%"}}>
                <DialogueContainer/>
            </div>
        </div>
    )
}

export default RightContainer