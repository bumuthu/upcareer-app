"use client";
import React from "react";
import { Button, Card, Divider, Tag } from "antd";
import { BaseInterviewModel, CategoryModel } from "../../models/entities";
import { getTrimmedText } from "../../utils/utils";
import { useRouter } from "next/navigation";
import { PublicRestService } from "@/services/client-side/api-services/public-rest-service";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";

interface BaseInterviewCardProp {
	baseInterview: BaseInterviewModel;
	setOpenedBaseInterview: React.Dispatch<
		React.SetStateAction<BaseInterviewModel | undefined>
	>;
	setPopUpIsOpened: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const BaseInterviewCard: React.FC<BaseInterviewCardProp> = (
	props: BaseInterviewCardProp
) => {
	const publicService = new PublicRestService();
	const router = useRouter();
	const onClickCard = async (id: string) => {
		try {
			console.log("Clicked card");
			const baseInterviewRes = await publicService.getBaseInterviewById({
				baseInterviewId: id,
			});
			router.push(`?opened=${id}`);
			props.setPopUpIsOpened!(true);
			props.setOpenedBaseInterview!(baseInterviewRes);
		} catch (err) {
			console.log("Clicked card error: ", err);
		}
	};
	return (
		<>
			<Card
				style={{
					// border: "0.1px solid #D1D1D1",
					width: 400,
					margin: "5px",
					borderRadius: "5px",
					padding: "0px 10px",
					boxShadow: "0px 5px 10px rgba(0,0,0,0.05)",
					cursor: "pointer"
				}}
				onClick={() => onClickCard(props.baseInterview._id)}
			>
				<Title level={4} style={{ marginTop:"10px", marginBottom: "2px", textAlign: "center" }}>
					{props.baseInterview.title}
				</Title>
				<Paragraph
					style={{ color: "#1890ff", marginBottom: 20, textAlign: "center" }}
				>
					{(props.baseInterview.category as CategoryModel).name}
				</Paragraph>

				<div style={{ marginBottom: 20, textAlign: "center" }}>
					{props.baseInterview?.keywords.slice(0, 2).map((tag, index) => (
						<Tag
							key={index}
							style={{
								padding: "0 15px",
								borderRadius: "15px",
								background: "white",
								border: "1px solid #B4B4B4",
							}}
						>
							{tag}
						</Tag>
					))}

					<Tag
						bordered={false}
						style={{
							padding: "0 7px",
							borderRadius: "15px",
							background: "#1890ff",
							color: "white",
						}}
					>
						+{props.baseInterview?.keywords.length - 2}
					</Tag>
				</div>

				<Paragraph style={{ marginBottom: 20, textAlign: "center", fontSize: 12 }}>
					{getTrimmedText(props.baseInterview.jobDescription, 100)}
				</Paragraph>

				<Divider style={{ borderTop: "1px solid #e8e8e8", margin: "5px 0px" }} />

				<Button
					type="text"
					style={{ width: "100%", margin: 0, padding: 0 }}
					onClick={() => onClickCard(props.baseInterview._id)}
				>
					<span style={{fontWeight: 'bold',  fontSize: 12}}>READ MORE</span>
				</Button>
			</Card>
		</>
	);
};

export default BaseInterviewCard;
