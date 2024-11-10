import { useInterviewContext } from '@/context/InterviewContext'
import { BaseInterviewModel, CategoryModel, UserInterviewModel } from '@/models/entities'
import { PublicRestService } from '@/services/client-side/api-services/public-rest-service'
import { Card, Typography } from 'antd'
import React, { useEffect, useState } from 'react'

const TitleContainer = () => {
	const [currentBaseInterview, setCurrentBaseInterview] = useState<BaseInterviewModel>()
	const interviewContext = useInterviewContext()
	const [duration, setDuration] = useState("");

    useEffect(() => {
        // Parse the start and end timestamps
        const start = interviewContext.activeUserInterview?.startedAt!;
        const end = interviewContext.activeUserInterview?.endedAt!;
        
        // Calculate the difference in milliseconds
        const diffInMs = end - start;

        // Calculate minutes and seconds
        const minutes = Math.floor(diffInMs / 60000);
        const seconds = Math.floor((diffInMs % 60000) / 1000);

        // Format the duration as MM:SS
        setDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }, [interviewContext.activeUserInterview?.startedAt!, interviewContext.activeUserInterview?.endedAt!]);
	
	const formattedStartedAt = new Date(interviewContext.activeUserInterview?.startedAt!).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
	useEffect(()=>{
		console.log("sdsdsd",(interviewContext.activeUserInterview?.baseInterview as BaseInterviewModel)?.category as CategoryModel )
	},[])

	return (
		<div>
			<Card>
				<Typography.Title level={3} style={{marginBottom:"30px"}}>{(interviewContext.activeUserInterview?.baseInterview as BaseInterviewModel)?.title}</Typography.Title>
				<Typography.Paragraph>{((interviewContext.activeUserInterview?.baseInterview as BaseInterviewModel)?.category as CategoryModel)?.name}</Typography.Paragraph>
				<div style={{display:"flex", flexDirection:"row", gap:"15px"}}>
					<Typography.Paragraph>Duration</Typography.Paragraph>
					<Typography.Title level={3} style={{margin:"0"}} >{duration}</Typography.Title>
				</div>
				<Typography.Title level={4} style={{marginTop:"6px"}}>{formattedStartedAt}</Typography.Title>
				
			</Card>
		</div>
	)
}

export default TitleContainer