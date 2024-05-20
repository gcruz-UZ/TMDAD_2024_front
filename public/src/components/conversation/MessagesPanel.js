import { useEffect, useRef, useState } from "react"

// component
import Message from "./Message"
import WriteMessage from "./WriteMessage"
import Loading from "../Loading"
import { connectBackend } from "../connectBackend"
import { connectKotlinBackend } from "../connectKotlinBackend"
import UserSelectionModal from '../layout/UserSelectionModal';
import DeleteUserModal from '../layout/DeleteUserModal';

// Constants
import Constants from "../Constants"

const MessagesPanel = (props) => {
	const [isModalOpen, setModalOpen] = useState(false);
	const openModal = () => setModalOpen(true);
	const closeModal = () => setModalOpen(false);
	const submitSelectedUsers = (selectedUsers) => {
		console.log('Selected Users:', selectedUsers);

		selectedUsers.map((login) => {
			try {
				const config = {
				  withCredentials: true,
				  method: allConstants.method.PUT,
				  url: allConstants.deleteKotlinUserInRoom.replace("{id}", selectedRoomId).replace("{login}", login),
				  header: allConstants.header,
				}
		  
			  const res = connectKotlinBackend(config)
		  
				// // set the messages field of the state with the data
				// setMessagePanelData((prevState) => {
				//   return {
				// 	...prevState,
				// 	showLoading: false,
				// 	disableTextArea: false,
				// 	messages: res.data,
				// 	showMessagePanel2: true,
				//   }
				// })
			  } catch (err) {
				console.log("Error occurred...", err)
			  }
		})

		// API call to add users to the room can be done here
		closeModal();
	};

	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const openDeleteModal = () => setDeleteModalOpen(true);
	const closeDeleteModal = () => setDeleteModalOpen(false);
	const submitDeletedUsers = (deletedUsers) => {
		console.log('Deleted Users:', deletedUsers);

		deletedUsers.map((login) => {
			try {
				const config = {
				  withCredentials: true,
				  method: allConstants.method.DELETE,
				  url: allConstants.deleteKotlinUserInRoom.replace("{id}", selectedRoomId).replace("{login}", login),
				  header: allConstants.header,
				}
		  
			  const res = connectKotlinBackend(config)
		  
				// // set the messages field of the state with the data
				// setMessagePanelData((prevState) => {
				//   return {
				// 	...prevState,
				// 	showLoading: false,
				// 	disableTextArea: false,
				// 	messages: res.data,
				// 	showMessagePanel2: true,
				//   }
				// })
			  } catch (err) {
				console.log("Error occurred...", err)
			  }
		})

		// API call to add users to the room can be done here
		closeDeleteModal();
	};

  // Initialize the initial state and its modifier function
  const [messagePanelData, setMessagePanelData] = useState({
    messages: [],
    showLoading: false,
    disableTextArea: true,
    selectedRoomId: "",
    selectedRoomName: "",
	showMessagePanel2: true,
  })

  const [lastMsgSocketId, setLastMsgSocketId] = useState("")
//   const [lastRemovedRoomFromSocketId, setLastRemovedRoomFromSocketId] = useState("")

  // instantiate the Constants
  const allConstants = Constants()
  const messageEnd = useRef(null)

  const [cookies, setCookies] = useState({});

  // when the component is mounted
  useEffect(() => {
    if (
      props.selectedRoomId &&
      props.selectedRoomId != messagePanelData.selectedRoomId
    ) {
      // load the messages when the nextProps is different from the present one
      loadConversation(props.selectedRoomId, props.selectedRoomName)
    }

	//Necesario porq si no me daba error al cambiar de las de trends/stats a la room normal
	if(messageEnd.current != null)
	{
		scrollToBottom()
	}
    processNewMessage()
    processRemovedRoom()
  })

  const scrollToBottom = () => {
    messageEnd.current.scrollIntoView({ block: "end", behavior: "smooth" })
  }




































  // load the conversation of the selected friend
  const loadConversation = async (id, roomName) => {
	if(props.selectedRoomId == allConstants.trendingsId || props.selectedRoomId == allConstants.statsId)
	{
		//Es la de trends o stats
		setMessagePanelData((prevState) => {
			return {
			...prevState,
			showLoading: true,
			disableTextArea: true,
			selectedRoomId: id,
			showMessagePanel2: true,
			}
		})
		try {
			// const config = {
			// withCredentials: true,
			// method: allConstants.method.GET,
			// url: allConstants.getKotlinAdConversation,
			// header: allConstants.header,
			// }

			// const res = await connectKotlinBackend(config)

			// set the messages field of the state with the data
			setMessagePanelData((prevState) => {
			return {
				...prevState,
				showLoading: false,
				disableTextArea: false,
				// messages: res.data,
				messages: [],
				showMessagePanel2: true,
			}
			})
		} catch (err) {
			console.log("Error occurred...", err)
		}
	}
	else if(props.selectedRoomId == allConstants.adId)
	{
		//Es la de PUBLI
		setMessagePanelData((prevState) => {
			return {
			  ...prevState,
			  showLoading: true,
			  disableTextArea: true,
			  selectedRoomId: id,
			  showMessagePanel2: true,
			}
		  })
		  try {
			const config = {
			  withCredentials: true,
			  method: allConstants.method.GET,
			  url: allConstants.getKotlinAdConversation,
			  header: allConstants.header,
			}
	  
		  const res = await connectKotlinBackend(config)

		  //Los ordenamos
		  let sortedMessages = res.data.sort((a, b) => {
			return new Date(a.timeSent) - new Date(b.timeSent)
		  })
	  
			// set the messages field of the state with the data
			setMessagePanelData((prevState) => {
			  return {
				...prevState,
				showLoading: false,
				disableTextArea: false,
				messages: res.data,
				messages: sortedMessages,
				showMessagePanel2: true,
			  }
			})
		  } catch (err) {
			console.log("Error occurred...", err)
		  }
	}
	else
	{
		//Es la normal
		setMessagePanelData((prevState) => {
			return {
			  ...prevState,
			  showLoading: true,
			  disableTextArea: true,
			  selectedRoomId: id,
			  selectedRoomName: roomName,
			  showMessagePanel2: true,
			}
		  })
		  //Actualizamos tiempo de ultimo acceso a la room
			try {
				const config = {
				withCredentials: true,
				method: allConstants.method.PUT,
				url: allConstants.updateLastAccess.replace("{userId}", props.userInfo.id).replace("{roomId}", id),
				header: allConstants.header,
				}
		
			const res = connectKotlinBackend(config)
		
				// // set the messages field of the state with the data
				// setMessagePanelData((prevState) => {
				//   return {
				// 	...prevState,
				// 	showLoading: false,
				// 	disableTextArea: false,
				// 	messages: res.data,
				// 	showMessagePanel2: true,
				//   }
				// })
			} catch (err) {
				console.log("Error occurred...", err)
			}


		  try {
			const config = {
			  withCredentials: true,
			  method: allConstants.method.GET,
			  url: allConstants.getKotlinConversation.replace("{id}", id),
			  header: allConstants.header,
			}
	  
		  const res = await connectKotlinBackend(config)

		  //Los ordenamos
		  let sortedMessages = res.data.sort((a, b) => {
			return new Date(a.timeSent) - new Date(b.timeSent)
		  })
	  
			// set the messages field of the state with the data
			setMessagePanelData((prevState) => {
			  return {
				...prevState,
				showLoading: false,
				disableTextArea: false,
				messages: sortedMessages,
				showMessagePanel2: true,
			  }
			})
		  } catch (err) {
			console.log("Error occurred...", err)
		  }
	}
  }






































  const processNewMessage = () => {
    if (
      props.newMessageFromSocket &&
      props.newMessageFromSocket.id !== lastMsgSocketId
    ) {
		const { roomId, id } = props.newMessageFromSocket

      // if the current message is from the selected room also
      if (roomId == messagePanelData.selectedRoomId) {
        setMessagePanelData((prevState) => {
          return {
            ...prevState,
            messages: [
              ...prevState.messages,
              { ...props.newMessageFromSocket },
            ],
          }
        })

		//Actualizamos tiempo de ultimo acceso a la room
		if(roomId > 0)
		{
			try {
				const config = {
					withCredentials: true,
					method: allConstants.method.PUT,
					url: allConstants.updateLastAccess.replace("{userId}", props.userInfo.id).replace("{roomId}", roomId),
					header: allConstants.header,
				}
			
				const res = connectKotlinBackend(config)
			
				// // set the messages field of the state with the data
				// setMessagePanelData((prevState) => {
				//   return {
				// 	...prevState,
				// 	showLoading: false,
				// 	disableTextArea: false,
				// 	messages: res.data,
				// 	showMessagePanel2: true,
				//   }
				// })
				} catch (err) {
				console.log("Error occurred...", err)
				}
		}

        setLastMsgSocketId(id)
        scrollToBottom()
      }
    }
  }

  const processRemovedRoom = () => {
    // if (
    //   props.removedRoomFromSocket &&
    //   props.removedRoomFromSocket.id !== lastRemovedRoomFromSocketId
    // ) {
	// 	console.log("aqui")
    //   // if the removed room is from the selected room
    //   if (props.removedRoomFromSocket.id == messagePanelData.selectedRoomId) {
    //     setMessagePanelData((prevState) => {
	// 		return {
	// 		  ...prevState,
    // 		  selectedRoomId: "",
	// 		  showMessagePanel2: false,
	// 		}
	// 	  })
    //     setLastRemovedRoomFromSocketId(props.removedRoomFromSocket.id)
    //   }
    // }

	if (
		props.removedRoomFromSocket &&
		props.removedRoomFromSocket.id == messagePanelData.selectedRoomId
	  ) {
		// if the removed room is from the selected room
		setMessagePanelData((prevState) => {
			return {
			...prevState,
			selectedRoomId: "",
			showMessagePanel2: false,
			}
		})
	  }
  }

  const addUserToRoom = () => {
    // Implement the functionality to add a user to the room
    alert("Add user to the room functionality goes here");
  }

  const deleteRoom = async () => {
	const result = confirm("Are you sure you want to delete the room?");
	if (result === true) {
		try {
			const config = {
				withCredentials: true,
				method: allConstants.method.DELETE,
				url: allConstants.deleteKotlinRoom.replace("{id}", selectedRoomId),
				header: allConstants.header,
			  }
	
			const response = await connectKotlinBackend(config)
			// setUsers(response.data); // Assuming the response data is an array of user objects
		  } catch (error) {
			console.error('Error deleting room:', error);
		  }
	}
  }

  const { showLoading, disableTextArea, selectedRoomId, selectedRoomName, showMessagePanel2 } = messagePanelData
  const { userInfo, showMessagePanel } = props
  const messageStyle =
    (showMessagePanel == true && showMessagePanel2 == true) ? "message-panel" : "message-panel hide-div"

// console.log("Selected ROOM ID from MESSAGES PANEL: ", selectedRoomId)

// console.log("oli oli")

let messagesPanelBody = <div className="show-messages">
	{showLoading == true ? (
	<Loading />
	) : (
			messagePanelData.messages.map((message) => {
				return <Message key={message.id} {...message} userInfo={userInfo} />
			})
	)}
	<div style={{ float: "left", clear: "both" }} ref={messageEnd}></div>
	</div>

let messagesPanelWrite = ""
if(selectedRoomId > 0 || selectedRoomId == allConstants.adId)
{
	messagesPanelWrite = <WriteMessage
			isDisabled={disableTextArea}
			userInfo={userInfo}
			selectedRoomId={selectedRoomId}
			stompClient={props.stompClient}/>
}
else
{
	messagesPanelWrite = ""
}

// console.log("User info: ", userInfo)
// console.log("selected room id: ", selectedRoomId)
let moderator = false
let room = userInfo.rooms.find(r => r.id === selectedRoomId)
if(room)
{
	moderator = room.moderatorId === userInfo.id
}
// console.log("MODERATOR: ", moderator)

let messagesPanelHeader = ""
if(selectedRoomId > 0)
{
	messagesPanelHeader = <div className="messages-panel-header">
							{/* <h2>{"ROOOOM NAME"}</h2> */}
							<h2>{selectedRoomName}</h2>
							{/* <button onClick={addUserToRoom}>Add User</button> */}
							{moderator && <button onClick={openModal}>Add User</button>}
							{moderator && <button onClick={openDeleteModal} className="delete-user">Delete User</button>}
							{moderator && <button onClick={deleteRoom} className="delete-room">Delete Room</button>}
							<UserSelectionModal
								isOpen={isModalOpen}
								onRequestClose={closeModal}
								onSubmit={submitSelectedUsers}
								selectedRoomId = {selectedRoomId}
							/>
							<DeleteUserModal
								isOpen={isDeleteModalOpen}
								onRequestClose={closeDeleteModal}
								onSubmit={submitDeletedUsers}
								selectedRoomId = {selectedRoomId}
								userLogin = {userInfo.login}
							/>
						</div>
}
else
{
	messagesPanelHeader = ""
}

//En funcion de si hemos escogido trends o stats no mostramos mensajes ni cuadro de escritura
if(selectedRoomId == allConstants.trendingsId)
{
	// messagesPanelBody = props.newTrendingsFromSocket
	messagesPanelBody = props.newTrendingsFromSocket.length > 0 ? props.newTrendingsFromSocket.split(',').map(m => (`<p>${m.trim()}</p>`)).join('') : ""
	messagesPanelWrite = ""
}
else if(selectedRoomId == allConstants.statsId)
{
	messagesPanelBody = props.newStatsFromSocket
	messagesPanelWrite = ""
}

  return (
    <div className={messageStyle}>
	  {messagesPanelHeader}
      {messagesPanelBody}
      {messagesPanelWrite}
    </div>
  )
}

export default MessagesPanel
