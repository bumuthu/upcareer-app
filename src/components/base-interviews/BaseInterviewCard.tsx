import React, { useState } from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Card } from "antd";
import { BaseInterviewModel } from "../../models/entities";
import { getTrimmedText } from "../../utils/utils";
import { useRouter } from "next/navigation";
import { PublicRestService } from "@/services/client-side/api-services/public-rest-service";

const { Meta } = Card;

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
        style={{ width: 300, cursor: "pointer" }}
        onClick={() => onClickCard(props.baseInterview._id)}
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
          avatar={
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
          }
          title={props.baseInterview.title}
          description={getTrimmedText(props.baseInterview.jobDescription, 50)}
        />
      </Card>
    </>
  );
};

export default BaseInterviewCard;
