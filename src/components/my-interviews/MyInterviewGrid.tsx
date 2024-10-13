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

const MyInterviewGrid = (props: props) => {
    const globalContext = useGlobalContext();
    const [categorizedInterviews, setCategorizedInterviews] = useState<{ [id: string]: UserInterviewModel[] }>({});
    useEffect(() => {
        const categorized = getCategorizeUserInterviews(
            props.userInterviews,
            globalContext.categories
        );
        setCategorizedInterviews(categorized);
    }, [props.userInterviews, globalContext.categories]);

    const getCategorizeUserInterviews = (
        userInterviews: UserInterviewModel[],
        categories: CategoryModel[]
    ): { [id: string]: UserInterviewModel[] } => {
        const groupedByCategory: { [id: string]: UserInterviewModel[] } = {};
        userInterviews.forEach(ui => {
            const baseInterview = ui.baseInterview as BaseInterviewModel;
            const category = categories.find(c => c._id == baseInterview.category);
            if (!groupedByCategory[category?._id]) groupedByCategory[category?._id] = [];
            groupedByCategory[category?._id].push(ui);
        })
        return groupedByCategory;
    };

    const getCategoryNameById = (id: string): string => {
        const category = globalContext.categories.find(c => c._id == id);
        return category?.name || "Uncategorized";
    }

    return (
        <div>
            {Object.keys(categorizedInterviews).map((categoryId) => (
                <div>
                    <Typography.Paragraph>{getCategoryNameById(categoryId)}</Typography.Paragraph>
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
                        dataSource={categorizedInterviews[categoryId]}
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
