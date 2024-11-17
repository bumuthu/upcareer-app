import { useInterviewContext } from '@/context/InterviewContext'
import { FormattedTreeData } from '@/services/client-side/interview-node-service'
import { Card, Skeleton, Typography } from 'antd'
import React, { useEffect, useState } from 'react'

const QuestionTreeContainer = () => {
	const interviewContext = useInterviewContext()
	const [selectedCardId, setSelectedCardId] = useState<string>();
	const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

	useEffect(() => {
		if (interviewContext.interviewNodeService) {
			interviewContext.setSelectedCardId!(interviewContext.interviewNodeService?.formatTree()[0]?.id!)
			setSelectedCardId(interviewContext.interviewNodeService?.formatTree()[0]?.id!)
		}
		
	}, [interviewContext.interviewNodeService])
	const handleCardClick = (cardId: string) => {
		setSelectedCardId(cardId);
		interviewContext.setSelectedCardId!(cardId)
	};

	const checkIsParent = (depth: number) => {
		if (depth != 1) return "20px"
	}
	return (
		<div>
			{interviewContext.interviewNodeService ?
				<Card style={{  overflowY: "auto", maxHeight: "720px", padding: "10px" }}>
					{interviewContext.interviewNodeService?.formatTree().length! > 0 ?
						<>{interviewContext.interviewNodeService?.formatTree() && interviewContext.interviewNodeService?.formatTree().map((tree: FormattedTreeData) => (
							<div key={tree.id}>
								{tree.depth == 1 &&
									<Card onMouseEnter={() => setHoveredCardId(tree.id)}
										onMouseLeave={() => setHoveredCardId(null)} onClick={() => handleCardClick(tree.id)} style={{
											cursor: "pointer",
											backgroundColor: selectedCardId === tree.id ? "#0D99FF" : hoveredCardId === tree.id ? "#f0f8ff" : "white",
											transition: "background-color 0.3s ease",
											border: "solid 1px", borderColor: "#0D99FF", width: "100%", marginBottom: "10px", marginLeft: checkIsParent(tree.depth),
										}}>
										<Typography style={{ fontWeight: "bold", color: selectedCardId === tree.id ? "white" : "#0D99FF" }}>{tree.node.question}</Typography>
									</Card>}
								{tree.children!.length > 0 && tree.children?.map((childNode) =>
									< Card key={childNode.id} onClick={() => handleCardClick(childNode.id)} style={{
										cursor: "pointer",
										backgroundColor: selectedCardId === childNode.id ? "#0D99FF": hoveredCardId === childNode.id ? "#f0f8ff" : "white",
										transition: "background-color 0.3s ease",
										border: "solid 1px", width: "100%", marginBottom: "10px", marginLeft: "20px",borderColor: "#0D99FF",
									}}>
										<Typography style={{ fontWeight: "bold", color: selectedCardId === childNode.id ? "white" : "#0D99FF" }}>{childNode.node.question}</Typography>
									</Card>)}
							</div>
						))}</> : <center><Typography.Paragraph >No interview data available. Start your interview now to begin!</Typography.Paragraph></center>}
				</Card> : 
				//skeletons
				<Card style={{ overflowY: "auto", height: "860px", padding: "50px" }}>
					<Card style={{ marginBottom: "20px", marginRight: "40px" }}>

						<Skeleton active paragraph={{ rows: 1, width: "100%" }} />
					</Card>
					<Card style={{ marginBottom: "20px", marginLeft: "60px" }}>

						<Skeleton active paragraph={{ rows: 1, width: "100%" }} />
					</Card>
					<Card style={{ marginBottom: "20px", marginRight: "40px" }}>

						<Skeleton active paragraph={{ rows: 1, width: "100%" }} />
					</Card>
					<Card style={{ marginBottom: "20px", marginLeft: "60px" }}>
						<Skeleton active paragraph={{ rows: 1, width: "100%" }} />
					</Card>
				</Card>}
		</div >
	)
}

export default QuestionTreeContainer