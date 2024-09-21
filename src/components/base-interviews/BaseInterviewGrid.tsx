import React, { useEffect, useState } from "react";
import { List } from "antd";
import BaseInterviewCard from "./BaseInterviewCard";
import { BaseInterviewModel } from "../../models/entities";
import PopupModel from "../popup-model/PopupModel";
import { useRouter, useSearchParams } from "next/navigation";
import { PublicRestService } from "@/services/client-side/api-services/public-rest-service";

interface BaseInterviewGridProp {
  baseInterviews: BaseInterviewModel[];
}

const BaseInterviewGrid: React.FC<BaseInterviewGridProp> = (
  props: BaseInterviewGridProp
) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const publicRestService = new PublicRestService();
  useEffect(() => {
    validateOpendebaseInterview();
  }, []);
  const validateOpendebaseInterview = async () => {
    try {
      const OpenedIdFromDb = searchParams.get("opened");
      if (OpenedIdFromDb) {
        const openedBaseInterviewFromDB =
          await publicRestService.queryBaseInterviewById({
            baseInterviewId: OpenedIdFromDb,
          });
        if (openedBaseInterviewFromDB) {
          setOpenedBaseInterview(openedBaseInterviewFromDB);
          setIsPopUpOpened(true);
        } else {
          router.replace("/");
          setOpenedBaseInterview(undefined);
          setIsPopUpOpened!(false);
        }
      } else {
        router.replace("/");
        setIsPopUpOpened!(false);
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  };
  const [openedBaseInterview, setOpenedBaseInterview] =
    useState<BaseInterviewModel>();
  const [isPopUpOpened, setIsPopUpOpened] = useState<boolean>();
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
        renderItem={(bi) => (
          <List.Item style={{ display: "flex", justifyContent: "center" }}>
            <BaseInterviewCard
              baseInterview={bi}
              setOpenedBaseInterview={setOpenedBaseInterview!}
              setPopUpIsOpened={setIsPopUpOpened!}
            />
          </List.Item>
        )}
      />
      <PopupModel
        baseInterview={openedBaseInterview!}
        isOpened={isPopUpOpened!}
        setIsOpened={setIsPopUpOpened!}
      />
    </div>
  );
};

export default BaseInterviewGrid;
