import { useAuthContext } from '@/context/AuthContext'
import { PrivateRestService } from '@/services/client-side/api-services/private-rest-service'
import { Button, message, Typography } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'
import React, { useEffect, useState } from 'react'

const UserSettings: React.FC = () => {
	const authContext = useAuthContext()
	const privateRestService = new PrivateRestService();

	useEffect(() => {
		setEditableName(authContext.currentUser?.name!)
	}, [])
	const [editableName, setEditableName] = useState<string>(authContext.currentUser?.name!)
	const [isLoading, setIsLoading] = useState<boolean>()
	const [isbtnDisable, setIsBtnDisable] = useState<boolean>(true)

	const updateUserInDB = async () => {
		try {
			setIsLoading(true)
			const updatedUser = await privateRestService.updateUser({ name: editableName })
			setIsBtnDisable(true)
			message.success("Update Successful!")
			setIsLoading(false)
		}
		catch (error) {
			console.log("update user error: ", error)
			setIsLoading(false)
			setIsBtnDisable(false)
		}
	}
	const handleChange = (editableName: string) => {
		if (!editableName || editableName.trim() === "") {
			message.warning("Name cannot be empty!")
			return;
		}
		setEditableName(editableName)
		setIsBtnDisable(false)
	}
	const cancelClick = () => {
		setIsBtnDisable(true)
		setEditableName(authContext.currentUser?.name!)
	}
	return (
		<div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", }}>
			<div style={{ marginTop: "50px", padding: "50px",  width: "500px", border: "1px solid #e0e0e0", borderRadius: "10px" }}>
				<Typography.Title level={5}>Name</Typography.Title>
				<Paragraph editable={{
					triggerType: ["text"],
					icon: false,
					tooltip: "click to edit your name", 
					onChange: handleChange
				}} style={{ margin: "20px 50px", fontSize: "15px" }}>
					{editableName}
				</Paragraph>

				<Typography.Title level={5} style={{ marginTop: "60px" }}>Email</Typography.Title>
				<Paragraph type="secondary" style={{ margin: "20px 50px", fontSize: "15px" }}>{authContext.currentUser?.email}</Paragraph>

				{!isbtnDisable && <div style={{ display: "flex", justifyContent: "right", marginLeft: "auto", marginTop: "100px", gap: "10px" }}>
					<Button type='default' style={{ padding: "0 2rem" }} onClick={() => cancelClick()}>cancel</Button>
					<Button type='primary' style={{ padding: "0 2.5rem", backgroundColor: "#0D99FF" }} loading={isLoading} onClick={() => updateUserInDB()}>Update</Button>
				</div>
				}
			</div>
		</div>
	)
}

export default UserSettings