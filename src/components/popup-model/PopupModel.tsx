"use client";
import { BaseInterviewModel } from "@/models/entities";
import { ShareAltOutlined, StarTwoTone } from "@ant-design/icons";
import { ChatBubbleOvalLeftIcon, StarIcon } from "@heroicons/react/24/outline";
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { Button, Card, Col, Modal, Row, Tag } from "antd";
import React, { useEffect } from "react";
interface popupProps {
  baseInterview: BaseInterviewModel;
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}
const PopupModel = (props: popupProps) => {
  const jobTags = ["UI", "UX", "Photoshop", "UX", "Photoshop"];
  useEffect(() => {
    if (props.isOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [props.isOpened]);
  return (
    <div>
      <Modal
        width={1200}
        open={props.isOpened!}
        onCancel={() => props.setIsOpened!(false)}
        style={{ backdropFilter: "blur(10px)" }}
        footer={[]}
        bodyStyle={{ overflowY: "auto", maxHeight: "80vh" }}
      >
        <div style={{ padding: "40px", maxWidth: "1200px" }}>
          {/* Job Description Section */}
          <Row justify="space-between" align="middle">
            <Col>
              <h1>{props.baseInterview?.title!}</h1>
              <p style={{ color: "blue", margin: "0 0 20px 0" }}>Web Design</p>
              <div>
                {jobTags.map((tag, index) => (
                  <Tag key={index} style={{ marginBottom: "8px" }}>
                    {tag}
                  </Tag>
                ))}
              </div>
            </Col>
            <Col style={{ marginBottom: "60px" }}>
              <Button
                type="primary"
                size="large"
                style={{
                  marginRight: "15px",
                  paddingLeft: "40px",
                  paddingRight: "40px",
                }}
              >
                Start
              </Button>
              <Button
                icon={<ShareAltOutlined />}
                style={{ marginRight: "15px" }}
              />
              <Button icon={<StarTwoTone />} style={{ color: "blue" }} />
            </Col>
          </Row>

          {/* Job Description Details */}
          <Row style={{ marginTop: "40px" }}>
            <Col span={24}>
              <h3>Job Description</h3>
              <p>{props.baseInterview?.jobDescription!}</p>
            </Col>
          </Row>

          {/* About Interview Section */}
          <Row style={{ marginTop: "40px" }}>
            <Col span={24}>
              <h3>About Interview</h3>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s...
              </p>
            </Col>
          </Row>

          {/* Interview Features */}
          <Row gutter={[16, 16]} style={{ marginTop: "40px" }}>
            <Col span={8}>
              <Card>
                <div style={{ textAlign: "center" }}>
                  <MicrophoneIcon width={35} height={35} />
                  <h4>Oral Interview</h4>
                  <p>
                    This will be an oral interview. Please keep in mind to turn
                    your mic on before the interview.
                  </p>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <div style={{ textAlign: "center" }}>
                  <StarIcon width={35} height={35} />
                  <h4>Evaluation Report</h4>
                  <p>
                    At the end of the interview, you will be able to see the
                    evaluated results.
                  </p>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <div style={{ textAlign: "center" }}>
                  <ChatBubbleOvalLeftIcon width={35} height={35} />
                  <h4>Feedback Report</h4>
                  <p>
                    At the end of the interview, you will get a feedback report
                    about the interview.
                  </p>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default PopupModel;
