import React from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { BaseInterviewModel } from '../../models/entities';
import { getTrimmedText } from '../../utils/utils';

const { Meta } = Card;

interface BaseInterviewCardProp {
    baseInterview: BaseInterviewModel
}

const BaseInterviewCard: React.FC<BaseInterviewCardProp> = (props: BaseInterviewCardProp) => {

    const onClickCard = () => {
        console.log("Clicked card")
    }
    return (
        <Card
            style={{ width: 300, cursor: 'pointer' }}
            onClick={onClickCard}
            cover={
                <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
            }
            actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
            ]}
        >
            <Meta
                style={{ textAlign: "justify" }}
                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                title={props.baseInterview.title}
                description={getTrimmedText(props.baseInterview.jobDescription, 50)}
            />
        </Card>
    )
}


export default BaseInterviewCard;