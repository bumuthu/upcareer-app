"use client";
import { BaseInterviewModel, CategoryModel } from "@/models/entities";
import { PrivateRestService } from "@/services/client-side/api-services/private-rest-service";
import { ShareAltOutlined, StarTwoTone } from "@ant-design/icons";
import { ChatBubbleOvalLeftIcon, StarIcon } from "@heroicons/react/24/outline";
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { Button, Card, Col, Modal, Row, Tag } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { useInterviewContext } from "../../context/InterviewContext";
import ReactMarkdown from "react-markdown";
import { InterviewDifficulty, InterviewMode } from "../../models/enum";

const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;

interface popupProps {
    baseInterview: BaseInterviewModel;
    isOpened: boolean;
    setIsOpened: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}
const PopupModel = (props: popupProps) => {
    const [isLoading, setIsloading] = useState<boolean>()
    const router = useRouter();
    const authContext = useAuthContext();
    const interviewContext = useInterviewContext();

    const startClick = async () => {
        try {
            setIsloading(true)
            const privateRestService = new PrivateRestService();
            const userInterview = await privateRestService.createUserInterview({
                baseInterviewId: props.baseInterview._id,
                difficulty: InterviewDifficulty.INTERMEDIATE, // TODO : Add difficulty
                mode: InterviewMode.LEARNING // TODO Add mode
            });
            interviewContext.setActiveUserInterview!(userInterview);
            setIsloading(false)
            router.push(`/interview/${userInterview._id}`);
        } catch (err) {
            console.log("Error, in start onclick");
        }
    };
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

    const getRedirectUrl = () => {
        if (props.baseInterview) {
            return `${baseUrl}/?opened=${props.baseInterview._id}`
        }
        return baseUrl;
    }
    return (
        <div>
            <Modal
                width={1200}
                open={props.isOpened!}
                onCancel={() => {
                    router.push('/');
                    props.setIsOpened!(false)
                }}
                footer={[]}
                closeIcon={false}
                style={{ backdropFilter: "blur(10px)", top: "5vh" }}
                styles={{
                    body: {
                        overflowY: "auto",
                        maxHeight: "85vh",
                    },
                }}
            >
                <div style={{ padding: "20px", paddingTop: "10px", maxWidth: "1200px" }}>
                    {/* Job Description Section */}
                    <Row justify="space-between" align="middle">
                        <Col>
                            <h1 style={{ marginBottom: "0" }}>{props.baseInterview?.title!}</h1>
                            {
                                props.baseInterview?.category &&
                                <p style={{ color: "blue", marginBottom: "20px", marginTop: "0" }}>{(props.baseInterview?.category as CategoryModel).name}</p>
                            }
                            <div>
                                {props.baseInterview?.keywords.map((tag, index) => (
                                    <Tag color="blue" bordered={false} key={index} style={{ marginBottom: "8px" }}>
                                        {tag}
                                    </Tag>
                                ))}
                            </div>
                        </Col>
                        <Col style={{ marginBottom: "60px" }}>
                            {
                                authContext.isAuthenticated ?
                                    <Button
                                        loading={isLoading}
                                        onClick={() => startClick()}
                                        type="primary"
                                        size="large"
                                        style={{
                                            marginRight: "15px",
                                            paddingLeft: "40px",
                                            paddingRight: "40px",
                                        }}
                                    >
                                        Start
                                    </Button> :
                                    <Button
                                        loading={isLoading}
                                        onClick={() => setIsloading(true)}
                                        type="primary"
                                        size="large"
                                        style={{
                                            marginRight: "15px",
                                            paddingLeft: "40px",
                                            paddingRight: "40px",
                                        }}>
                                        <LoginLink postLoginRedirectURL={getRedirectUrl()}>
                                            Log in
                                        </LoginLink>
                                    </Button>
                            }
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
                            <ReactMarkdown className="text-sm" remarkPlugins={[]}>
                                {props.baseInterview?.jobDescription}
                            </ReactMarkdown>
                        </Col>
                    </Row>

                    {/* About Interview Section */}
                    <Row style={{ marginTop: "40px" }}>
                        <Col span={24}>
                            <h3>About Interview</h3>
                            <ReactMarkdown className="text-sm" remarkPlugins={[]}>
                                {props.baseInterview?.aboutInterview}
                            </ReactMarkdown>
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
