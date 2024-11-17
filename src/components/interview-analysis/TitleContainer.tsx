import { useInterviewContext } from '@/context/InterviewContext'
import { BaseInterviewModel, CategoryModel } from '@/models/entities'
import { Card, Skeleton, Typography } from 'antd'
import React, { useEffect, useState } from 'react'

const TitleContainer = () => {
	const [currentBaseInterview, setCurrentBaseInterview] = useState<BaseInterviewModel>()
	const interviewContext = useInterviewContext()
	const [duration, setDuration] = useState("");

	useEffect(() => {
		const start = interviewContext.activeUserInterview?.startedAt!;
		const end = interviewContext.activeUserInterview?.endedAt!;

		const diffInMs = end - start;
	
		const minutes = Math.floor(diffInMs / 60000);
		const seconds = Math.floor((diffInMs % 60000) / 1000);

		setDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
	}, [interviewContext.activeUserInterview?.startedAt!, interviewContext.activeUserInterview?.endedAt!]);

	const formattedStartedAt = new Date(interviewContext.activeUserInterview?.startedAt!).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	useEffect(() => {
		console.log("sdsdsd", (interviewContext.activeUserInterview?.baseInterview as BaseInterviewModel)?.category as CategoryModel)
	}, [])

	return (
		<div>{interviewContext.activeUserInterview ?
			<Card>
				<Typography.Title level={3} style={{ marginBottom: "30px" }}>{(interviewContext.activeUserInterview?.baseInterview as BaseInterviewModel)?.title}</Typography.Title>
				<Typography.Paragraph>{((interviewContext.activeUserInterview?.baseInterview as BaseInterviewModel)?.category as CategoryModel)?.name}</Typography.Paragraph>
				<div style={{ display: "flex", flexDirection: "row", gap: "15px" }}>
					<Typography.Paragraph>Duration</Typography.Paragraph>
					<Typography.Title level={1} style={{ margin: "0" }} >{duration}</Typography.Title>
				</div>
				<Typography.Title level={4} style={{ marginTop: "6px" }}>{formattedStartedAt}</Typography.Title>

			</Card> :
				<Card>
					<Skeleton active paragraph={{ rows: 1 }} title={{ width: "60%" }} />
					<Skeleton active paragraph={{ rows: 1, width: "40%" }} />
				</Card>
			}
		</div>
	)
}

export default TitleContainer