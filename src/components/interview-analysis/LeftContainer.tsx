import React from 'react'
import TitleContainer from './TitleContainer'
import QuestionTreeContainer from './QuestionTreeContainer'
import { useMediaQuery } from 'react-responsive'
import { breakpoints } from '@/common/AppThemeProvider'

const LeftContainer = () => {
  const isSmallScreen = useMediaQuery({maxWidth: breakpoints.xl})
  return (
    <div style={{display:"flex", flexDirection:"column",gap:"20px", width:isSmallScreen?"100%":"40%"}}>
        <TitleContainer/>
        <QuestionTreeContainer/>
    </div>
  )
}

export default LeftContainer