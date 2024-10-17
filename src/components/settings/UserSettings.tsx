import { useAuthContext } from '@/context/AuthContext'
import { useGlobalContext } from '@/context/GlobalContext'
import { UserModel } from '@/models/entities'
import { PrivateRestService } from '@/services/client-side/api-services/private-rest-service'
import { Button, message, Typography } from 'antd'
import React, { useEffect, useState } from 'react'

const UserSettings: React.FC = () => {
	const globalContext = useGlobalContext()
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
		<div>
			<div style={{marginLeft:"100px"}}>
			<Typography.Title level={4} style={{ marginTop: "100px" }}>Name</Typography.Title>
			<Typography.Title editable={{
				tooltip: "click to edit your name", onChange: handleChange
			}} level={5} style={{ margin: 0 }}>
				{editableName}
			</Typography.Title>

			<Typography.Title level={4} style={{ marginTop: "60px" }}>Email</Typography.Title>
			<Typography.Title level={5} style={{ margin: 0 }}>{authContext.currentUser?.email}</Typography.Title>
			</div>
			{!isbtnDisable && <div style={{ display: "flex", justifyContent: "right", marginRight: "100px", marginTop: "100px" }}>
				<Button type='default' style={{ marginRight: "30px", padding: "0 2rem" }} onClick={() => cancelClick()}>cancel</Button>
				<Button type='primary' style={{ padding: "0 2.5rem" }} loading={isLoading} onClick={() => updateUserInDB()}>Update</Button>
			</div>
			}
		</div>
	)
}

export default UserSettings