"use client"
import { Button, message, Typography } from 'antd'
import React from 'react'

const ContactUs: React.FC = () => {
    const supportEmail: string = process.env.NEXT_PUBLIC_SUPPORT_EMAIL_ADDRESS!;
    const [messageApi, contextHolder] = message.useMessage();
    const handleEmailClick = () => {
        const mailtoUrl = `mailto:${supportEmail}`;
        window.open(mailtoUrl, "_blank");
    };
    const handleCopyClick = async () => {
        try {
            await navigator.clipboard.writeText(supportEmail);
            messageApi.open({
                type: 'success',
                content: 'Copied to clipboard.',
            });
        } catch (err) {
            console.log("Error from handlecopy clicked: ", err)
        }
    };
    return (
        <div style={{ display: "flex", gap: 10, width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <div style={{ marginBottom: "2.5rem"}}>
                    <Typography.Title level={2}>Contact Us</Typography.Title>
                    <div style={{ width: "90%", marginTop: "2.5rem", textAlign: "justify" }}>
                        <Typography.Text>
                            {`We're dedicated to providing you with the best support
                                possible. Currently, we're hard at work developing an in-app
                                support system to streamline your experience and ensure your
                                questions are answered promptly.`}
                        </Typography.Text>
                        <Typography.Text style={{ marginTop: "1rem", display: "block" }}>
                            {`While we're in the process of rolling out this exciting new
                                feature, you can still reach out to us via email `}
                            <Typography.Text strong>{supportEmail}</Typography.Text>
                            {` for any assistance you may need. Our team is ready and eager to help
                                you with any queries or concerns you may have.`}
                        </Typography.Text>
                    </div>
                </div>
                {contextHolder}
                <div style={{ display: "flex", gap: "1.25rem", marginTop: "2.5rem" }}>
                    <Button onClick={handleCopyClick} type="default" style={{ padding: "0 2rem" }}>
                        Copy Email Address
                    </Button>
                    <Button onClick={handleEmailClick} type="primary" style={{ padding: "0 2.5rem", backgroundColor:"#0D99FF" }}>
                        Open Email App
                    </Button>
                </div>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "60vh",
                width: "100%",
                paddingLeft: "10%",
                paddingRight: "15%"
            }}>
                <img src="/contact-us.svg" alt="talentuner contact us" />
            </div>
        </div>
    )
}

export default ContactUs