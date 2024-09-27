'use client'
import { BaseInterviewModel, UserInterviewModel } from '@/models/entities'
import { PrivateRestService } from '@/services/client-side/api-services/private-rest-service'
import { PublicRestService } from '@/services/client-side/api-services/public-rest-service'
import { ClearOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, Divider, Flex, Row, Space, Typography, Upload } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import Paragraph from 'antd/es/typography/Paragraph'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
interface UserInterviewProps {
    userInterview: UserInterviewModel
}
const UserInterviewContainer = (props: UserInterviewProps) => {
    const [baseInterview, setBaseInterview] = useState<BaseInterviewModel>()
    const [customJobDescription, setCustomJobDescription] = useState<string>('')
    const [loading, setIsloading] = useState<boolean>()
    const [isChecked, setIsChecked] = useState<boolean>()
    useEffect(() => {
        getBaseInterview()
        setCustomJobDescription(props.userInterview?.jobDescription!)
    }, [props.userInterview])

    const getBaseInterview = async () => {
        const publicRestService = new PublicRestService()
        console.log("userInterview in containr: ", props.userInterview)
        const baseInterviewdata = await publicRestService.queryBaseInterviewById({ baseInterviewId: props.userInterview.baseInterview as string })
        setBaseInterview!(baseInterviewdata)
    }
    const onClickApply = async () => {
        try {
            setIsloading(true)
            const privateRestService = new PrivateRestService()
            const updateRes = await privateRestService.updateUserInterview({ userInterviewId: props.userInterview._id, jobDescription: customJobDescription })
            setCustomJobDescription(updateRes.jobDescription!)
            setIsChecked(!isChecked)
            setIsloading(false)
        }
        catch (error) {
            console.log("Apply click error: ", error)
            setIsloading(false)
        }

    }

    return (
        < >
            {props.userInterview ? <>{/* Title Section */}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <Title level={2} style={{ margin: 0 }}>{baseInterview?.title}</Title>
                        <Paragraph style={{ color: "blue" }}>{baseInterview?.category}</Paragraph>
                    </div>

                    <Button type="primary" size="large" style={{
                        paddingLeft: "40px",
                        paddingRight: "40px",
                    }}>
                        Start
                    </Button>
                </div>

                <Divider />

                {/* Job Description Section */}
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                    <div>
                        <Title level={4}>Job Description</Title>
                        <Paragraph style={{ maxWidth: '500px', textAlign: "justify" }}>
                            {baseInterview?.jobDescription}
                        </Paragraph>
                    </div>

                    {/* Customization Section */}
                    <div>
                        <Space direction="vertical" size="large" style={{ marginTop: '20px' }}>
                            <Checkbox
                                checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)}
                            >
                                I want to customize the existing job description by adding the following text.
                            </Checkbox>

                            <TextArea
                                rows={6}
                                value={customJobDescription}
                                onChange={(e) => setCustomJobDescription(e.target.value)}
                                placeholder="Enter job description to append or overwrite the default one."
                                disabled={!isChecked}
                            />

                            {/* Buttons */}
                            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                <Button icon=  {<ClearOutlined/>} disabled={!isChecked} onClick={() => setCustomJobDescription('')}>
                                    Clear
                                </Button>
                                <Button type="primary" disabled={!isChecked} onClick={() => onClickApply()} loading={loading}>
                                    Apply
                                </Button>
                            </Space>
                        </Space>
                    </div>
                </div>

                <Divider />

                {/* CV Upload Section */}
                <Title level={4}>My CV</Title>
                <Upload >
                    <Button style={{ marginTop: "20px" }} icon={<UploadOutlined />}>Upload CV</Button>
                </Upload>
            </> : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "600px" }}><ClipLoader /></div>}</>
    );
};



export default UserInterviewContainer