'use client'
import { BaseInterviewModel, CategoryModel, UserInterviewModel } from '@/models/entities'
import { PrivateRestService } from '@/services/client-side/api-services/private-rest-service'
import { PublicRestService } from '@/services/client-side/api-services/public-rest-service'
import { ClearOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, Divider, Flex, Row, Space, Typography, Upload } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import Paragraph from 'antd/es/typography/Paragraph'
import Title from 'antd/es/typography/Title'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { UserInterviewStatus } from '../../models/enum'
import { useInterviewContext } from '../../context/InterviewContext'
import ReactMarkdown from 'react-markdown'
import { useMediaQuery } from 'react-responsive'
import { breakpoints } from '../../common/AppThemeProvider'

enum SubmitButton {
    APPLY = "Apply",
    EDIT = "Edit"
}
interface UserInterviewProps {
    userInterview: UserInterviewModel
}
const UserInterviewContainer = (props: UserInterviewProps) => {
    const [customJobDescription, setCustomJobDescription] = useState<string>('')
    const [loading, setIsloading] = useState<boolean>(false)
    const [startLoading, setStartLoading] = useState<boolean>(false)
    const [isChecked, setIsChecked] = useState<boolean>()
    const [textAreaEnabled, setTextAreaEnabled] = useState<boolean>(false)
    const [submitButtonEnabled, setSubmitButtonEnabled] = useState<boolean>(false);
    const [applyButton, setApplyButton] = useState<SubmitButton>(SubmitButton.APPLY);
    const router = useRouter()
    const interviewContext = useInterviewContext();
    const privateService = new PrivateRestService()
    const publicRestService = new PublicRestService()
    const isSmallScreen = useMediaQuery({ maxWidth: breakpoints.xl })

    useEffect(() => {
        if (props.userInterview) {
            setCustomJobDescription(props.userInterview?.jobDescription!)
            if (props.userInterview?.jobDescription) setIsChecked(true)
        }
    }, [props.userInterview])

    useEffect(() => {
        if (isChecked == undefined) return;
        const updateInterview = async () => {
            setIsloading(true)
            await privateService.updateUserInterview({ userInterviewId: props.userInterview._id, jobDescription: "" })
            setIsloading(false)
        }
        updateInterview()
        setTextAreaEnabled(isChecked)
        setSubmitButtonEnabled(isChecked)
        if (!isChecked) setCustomJobDescription("")
        if (isChecked) setApplyButton(SubmitButton.APPLY)
    }, [isChecked])

    const onClickApply = async () => {
        try {
            setIsloading(true)
            const privateRestService = new PrivateRestService()
            const updateRes = await privateRestService.updateUserInterview({ userInterviewId: props.userInterview._id, jobDescription: customJobDescription })
            setCustomJobDescription(updateRes.jobDescription!)
            setTextAreaEnabled(false)
            setIsloading(false)
            setApplyButton(SubmitButton.EDIT)
        }
        catch (error) {
            console.log("Apply click error: ", error)
            setIsloading(false)
        }
    }

    const onClickEdit = () => {
        setTextAreaEnabled(true);
        setApplyButton(SubmitButton.APPLY)
    }

    const onClickStart = async () => {
        setStartLoading(true)
        const activeUserInterview = await privateService.updateUserInterview({
            userInterviewId: props.userInterview._id,
            status: UserInterviewStatus.ORGANIZING
        });
        interviewContext.setActiveUserInterview!(activeUserInterview);
        router.push(`/interview/${props.userInterview._id}/ongoing`)
    }

    return (
        < >
            {props.userInterview ? <div style={{ margin: "auto 50px" }}>{/* Title Section */}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <Title level={2} style={{ margin: 0 }}>{(props.userInterview.baseInterview as BaseInterviewModel)?.title}</Title>
                        {
                            (props.userInterview.baseInterview as BaseInterviewModel)?.category &&
                            <Paragraph style={{ color: "blue" }}>{((props.userInterview.baseInterview as BaseInterviewModel)?.category as CategoryModel).name}</Paragraph>
                        }
                    </div>

                    <Button
                        type="primary"
                        size="large"
                        style={{
                            paddingLeft: "40px",
                            paddingRight: "40px",
                        }}
                        onClick={onClickStart}
                        loading={startLoading}
                    >
                        Start now
                    </Button>
                </div>

                <Divider />

                {/* Job Description Section */}
                <div style={{ display: "flex", justifyContent: "space-between", gap: "50px" }}>
                    <div style={{ width: "100%" }}>
                        <Title level={4}>Job Description</Title>
                        <Paragraph style={{ width: "100%" , textAlign: "justify", overflowY: "auto", maxHeight: "400px", padding: "20px" }}>
                            <ReactMarkdown className="text-sm" remarkPlugins={[]}>
                                {(props.userInterview.baseInterview as BaseInterviewModel)?.jobDescription}
                            </ReactMarkdown>
                        </Paragraph>
                    </div>

                    {/* Customization Section */}
                    {!isSmallScreen && <div style={{  width: "100%" }}>
                        <Space direction="vertical" size="large" style={{ marginTop: '20px', width: "100%" }}>
                            <Checkbox
                                checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)}
                            >
                                I want to customize the existing job description by adding the following text.
                            </Checkbox>

                            <TextArea
                                rows={15}
                                value={customJobDescription}
                                onChange={(e) => setCustomJobDescription(e.target.value)}
                                placeholder="Enter job description to append or overwrite the default one."
                                disabled={!textAreaEnabled}
                            />

                            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                {(applyButton == SubmitButton.EDIT) ?
                                    <Button style={{ width: "150px" }} type="primary" disabled={!submitButtonEnabled} onClick={onClickEdit} loading={loading}>
                                        Edit
                                    </Button> :
                                    <Button style={{ width: "150px" }} type="primary" disabled={!submitButtonEnabled} onClick={onClickApply} loading={loading}>
                                        Apply
                                    </Button>}

                            </Space>
                        </Space>
                    </div>
                    }
                </div>

                <Divider />

                {/* CV Upload Section */}
                <Title level={4}>My CV</Title>
                <Upload >
                    <Button style={{ marginTop: "20px" }} icon={<UploadOutlined />}>Upload CV</Button>
                </Upload>
            </div> : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "600px" }}><ClipLoader /></div>}</>
    );
};



export default UserInterviewContainer