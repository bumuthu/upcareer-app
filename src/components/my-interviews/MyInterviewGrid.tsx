import { Divider, List, Typography } from "antd";
import React, { useEffect, useState } from "react";
import MyInterviewCard from "./MyInterviewCard";
import {
    BaseInterviewModel,
    CategoryModel,
    UserInterviewModel,
} from "@/models/entities";
import { useGlobalContext } from "@/context/GlobalContext";
interface props {
    userInterviews: UserInterviewModel[];
}

interface categorizedInterviewsIf {
    categoryName: string;
    interviewsInThatCategory: UserInterviewModel[];
}
const MyInterviewGrid = (props: props) => {
    const globalContext = useGlobalContext();
    const [categorizedInterviews, setCategorizedInterviews] = useState<categorizedInterviewsIf[]>([]);
    useEffect(() => {
        const categorized = categorizeUserInterviews(
            props.userInterviews,
            globalContext.categories
        );
        setCategorizedInterviews(categorized);
    }, [props.userInterviews, globalContext.categories]);
    
    const categorizeUserInterviews = (
        userInterviews: UserInterviewModel[],
        categories: CategoryModel[]
    ): categorizedInterviewsIf[] => {
        return categories.map((category) => {
            const interviewsInThatCategory = userInterviews.filter((interview) => {
                const baseInterview = interview.baseInterview as BaseInterviewModel;
                const interviewCategory = baseInterview?.category as CategoryModel;
                return interviewCategory?.lookupKey === category.lookupKey;
            });

            return {
                categoryName: category.name,
                interviewsInThatCategory: interviewsInThatCategory,
            };
        });
    };

    return (
        <div>
            {categorizedInterviews.map((categoryItem) =>(
                <div>
                    <Typography.Paragraph>{categoryItem.categoryName}</Typography.Paragraph>
                    <Divider />
                    <List
                        grid={{
                            gutter: 16,
                            column: 3,
                            xl: 3,
                            lg: 2,
                            md: 2,
                            sm: 1,
                            xs: 1,
                        }}
                        dataSource={categoryItem.interviewsInThatCategory}
                        renderItem={(ui) => (
                            <List.Item style={{ display: "flex", justifyContent: "center" }}>
                                <MyInterviewCard userInterview={ui} />
                            </List.Item>
                        )}
                    />
                </div>
            ))}
        </div>
    );
};

export default MyInterviewGrid;
