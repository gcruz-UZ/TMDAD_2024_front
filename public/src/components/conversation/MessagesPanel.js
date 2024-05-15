import { useEffect, useRef, useState } from "react"

// component
import Message from "./Message"
import WriteMessage from "./WriteMessage"
import Loading from "../Loading"
import { connectBackend } from "../connectBackend"
import { connectKotlinBackend } from "../connectKotlinBackend"
import UserSelectionModal from '../layout/UserSelectionModal';

// Constants
import Constants from "../Constants"

const MessagesPanel = (props) => {
	const [isModalOpen, setModalOpen] = useState(false);
	const openModal = () => setModalOpen(true);
	const closeModal = () => setModalOpen(false);
	const submitSelectedUsers = (selectedUsers) => {
		console.log('Selected Users:', selectedUsers);
		// API call to add users to the room can be done here
		closeModal();
	};

  // Initialize the initial state and its modifier function
  const [messagePanelData, setMessagePanelData] = useState({
    messages: [],
    showLoading: false,
    disableTextArea: true,
    selectedRoomId: "",
	showMessagePanel2: true,
  })

  const [lastMsgSocketId, setLastMsgSocketId] = useState("")
  const [lastRemovedRoomFromSocketId, setLastRemovedRoomFromSocketId] = useState("")

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
      loadConversation(props.selectedRoomId)
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
  const loadConversation = async (id) => {
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
	  
			// set the messages field of the state with the data
			setMessagePanelData((prevState) => {
			  return {
				...prevState,
				showLoading: false,
				disableTextArea: false,
				messages: res.data,
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
			  showMessagePanel2: true,
			}
		  })
		  try {
			const config = {
			  withCredentials: true,
			  method: allConstants.method.GET,
			  url: allConstants.getKotlinConversation.replace("{id}", id),
			  header: allConstants.header,
			}
	  
		  const res = await connectKotlinBackend(config)
	  
			// set the messages field of the state with the data
			setMessagePanelData((prevState) => {
			  return {
				...prevState,
				showLoading: false,
				disableTextArea: false,
				messages: res.data,
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
        setLastMsgSocketId(id)
        scrollToBottom()
      }
    }
  }

  const processRemovedRoom = () => {
    if (
      props.removedRoomFromSocket &&
      props.removedRoomFromSocket.id !== lastRemovedRoomFromSocketId
    ) {
      // if the removed room is from the selected room
      if (props.removedRoomFromSocket.id == messagePanelData.selectedRoomId) {
        setMessagePanelData((prevState) => {
			return {
			  ...prevState,
			  showMessagePanel2: false,
			}
		  })
        setLastRemovedRoomFromSocketId(props.removedRoomFromSocket.id)
      }
    }
  }

  const addUserToRoom = () => {
    // Implement the functionality to add a user to the room
    alert("Add user to the room functionality goes here");
  }

  const { showLoading, disableTextArea, selectedRoomId, showMessagePanel2 } = messagePanelData
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
							<h2>{props.selectedRoomName}</h2>
							{/* <button onClick={addUserToRoom}>Add User</button> */}
							{moderator && <button onClick={openModal}>Add User</button>}
							{moderator && <button onClick={openModal} className="delete-user">Delete User</button>}
							{moderator && <button onClick={openModal} className="delete-room">Delete Room</button>}
							<UserSelectionModal
								isOpen={isModalOpen}
								onRequestClose={closeModal}
								onSubmit={submitSelectedUsers}
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
	messagesPanelBody = props.newTrendingsFromSocket
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
