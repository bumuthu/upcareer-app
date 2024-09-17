import React, { } from 'react';
import { List } from 'antd';
import BaseInterviewCard from './BaseInterviewCard';
import { BaseInterviewModel } from '../../models/entities';

interface BaseInterviewGridProp {
    baseInterviews: BaseInterviewModel[]    
}

const BaseInterviewGrid: React.FC<BaseInterviewGridProp> = (props: BaseInterviewGridProp) => {
    return (
        <div>
            <List
                grid={{
                    gutter: 16,
                    column: 4,
                    xl: 3,
                    lg: 3,
                    md: 2,
                    sm: 1,
                    xs: 1,
                }}
                dataSource={props.baseInterviews}
                renderItem={bi => (
                    <List.Item style={{  display: "flex", justifyContent: "center"}}>
                        <BaseInterviewCard baseInterview={bi}/>
                    </List.Item>
                )}
            />
        </div>
    )
}

export default BaseInterviewGrid;