import { useInterviewContext } from '@/context/InterviewContext'
import { FormattedTreeData } from '@/services/client-side/interview-node-service'
import { Card, Typography } from 'antd'
import React, { useEffect, useState } from 'react'

const QuestionTreeContainer = () => {
	const interviewContext = useInterviewContext()
	const [selectedCardId, setSelectedCardId] = useState<string>(interviewContext.interviewNodeService?.formatTree()[0].id!);
	const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

	useEffect(()=>{
		interviewContext.setSelectedCardId!(interviewContext.interviewNodeService?.formatTree()[0].id!)

	},[])
	const handleCardClick = (cardId: string) => {
		setSelectedCardId(cardId);
		interviewContext.setSelectedCardId!(cardId)
	};

	const checkIsParent = (depth: number) => {
		if (depth != 1) return "20px"
	}
	return (
		<div>
			<Card style={{ overflowY: "auto", maxHeight: "860px"}}>
				{interviewContext.interviewNodeService?.formatTree().map((tree: FormattedTreeData) => (
					<div key={tree.id}>
						{tree.depth == 1 &&
							<Card onMouseEnter={() => setHoveredCardId(tree.id)}
								onMouseLeave={() => setHoveredCardId(null)} onClick={() => handleCardClick(tree.id)} style={{
									cursor: "pointer",
									backgroundColor: selectedCardId === tree.id ? "#0D99FF" : hoveredCardId === tree.id ? "#f0f8ff" : "white",
									transition: "background-color 0.3s ease",
									border: "solid 1px", borderColor: "#0D99FF", width: "100%", marginBottom: "20px", marginLeft: checkIsParent(tree.depth)
								}}>
								<Typography style={{ fontWeight:"bold",color: selectedCardId === tree.id ? "white" : "#0D99FF"}}>{tree.node.question}</Typography>
							</Card>}
						{tree.children!.length > 0 && tree.children?.map((childNode) =>
							< Card key={childNode.id} onClick={() => handleCardClick(childNode.id)} style={{
								cursor: "pointer",
								backgroundColor: selectedCardId === childNode.id ? "#d0e8ff" : "white",
								transition: "background-color 0.3s ease",
								border: "solid 1px", width: "100%", marginBottom: "20px", marginLeft: "20px"
							}}>
								<Typography>{childNode.node.question}</Typography>
							</Card>)}
					</div>
				))}
			</Card>
		</div >
	)
}

export default QuestionTreeContainer