"use client";

import { useInterviewContext } from "@/context/InterviewContext";
import { EndingReason } from "@/models/enum";
import { PrivateRestService } from "@/services/client-side/api-services/private-rest-service";
import { Button, Rate, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

enum DisplayedEndReasonMessage {
    TIMEOUT_MESSAGE = "Timed out",
    COMPLETED_MESSAGE = "Successfully completed",
    CANCELLED_MESSAGE = "Cancelled"
}

const InterviewEndedNotice = () => {
    const interviewContext = useInterviewContext();
    const router = useRouter();
    const privateRestService = new PrivateRestService();
    const [ratingCount, setRatingCount] = useState<number>();
    const [comment, setComment] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>()

    const submitUserFeedback = async() =>{
        try{
            setIsLoading(true)
            await privateRestService.submitUserFeedback({
                rating: ratingCount!,
                comment:comment,
                userInterview: interviewContext.activeUserInterview?._id
            })
            router.push(`/my-interviews/${interviewContext.activeUserInterview?._id}`)
            setIsLoading(false)
        }
        catch(error){
            console.log("submit user feedback error: ", error)
            setIsLoading(false)
        }
    }

    const onSkip = () => {
        router.push(`/my-interviews/${interviewContext.activeUserInterview?._id}`)
    }

    const showEndingReason =()=>{
        switch (interviewContext.activeUserInterview?.endingReason) {
            case EndingReason.COMPLETING:
                return DisplayedEndReasonMessage.COMPLETED_MESSAGE
            case EndingReason.TIMEOUT:
                return DisplayedEndReasonMessage.TIMEOUT_MESSAGE
            case EndingReason.USER_CANCELLED:
                return DisplayedEndReasonMessage.CANCELLED_MESSAGE
        }
    }

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                height: "100%",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography style={{ fontSize: 32, fontWeight: 600 }}>
                The interview has been ended. How was it?
            </Typography>
            <Typography.Paragraph style={{ fontWeight: "bold", fontSize:"18px"}}>
                {showEndingReason()}
            </Typography.Paragraph>
            <Typography.Paragraph style={{ textAlign: "center", width: "500px" }}>
                Tell us about your experience during the interview. We would also
                appreciate your feedback or any suggestions for improving the system
            </Typography.Paragraph>
            <Rate style={{marginBottom:"60px",marginTop:"20px"}} onChange={(number: any) => setRatingCount(number)} />
            <TextArea rows={4} placeholder="Express your thoughts..." value={comment} onChange={(e)=>setComment(e.target.value)} style={{ height: 120, resize: 'none', width: "500px", backgroundColor: "#f1f1f1" }} />
            <div style={{display: "flex", marginTop:"150px", gap:"10px"}}>
                <Button type="text" style={{borderColor:"gray", paddingLeft:"30px", paddingRight:"30px"}} onClick={onSkip}>Skip</Button>
                <Button type = "primary"style={{paddingLeft:"30px", paddingRight:"30px"}} loading = {isLoading} onClick={submitUserFeedback} disabled = {(ratingCount == undefined || ratingCount == 0) ? true:false}>Rate & See Results</Button>
            </div>

        </div>
    );
};

export default InterviewEndedNotice;
