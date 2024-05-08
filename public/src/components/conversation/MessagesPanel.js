import { useEffect, useRef, useState } from "react"

// component
import Message from "./Message"
import WriteMessage from "./WriteMessage"
import Loading from "../Loading"
import { connectBackend } from "../connectBackend"
import { connectKotlinBackend } from "../connectKotlinBackend"

// Constants
import Constants from "../Constants"

const MessagesPanel = (props) => {
  // Initialize the initial state and its modifier function
  const [messagePanelData, setMessagePanelData] = useState({
    messages: [],
    showLoading: false,
    disableTextArea: true,
    selectedRoomId: "",
  })

  const [lastMsgSocketId, setLastMsgSocketId] = useState("")

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
    scrollToBottom()
    processNewMessage()
  })

  const scrollToBottom = () => {
    messageEnd.current.scrollIntoView({ block: "end", behavior: "smooth" })
  }

  // load the conversation of the selected friend
  const loadConversation = async (id) => {
    setMessagePanelData((prevState) => {
      return {
        ...prevState,
        showLoading: true,
        disableTextArea: true,
        selectedRoomId: id,
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
        }
      })
    } catch (err) {
      console.log("Error occurred...", err)
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

  const { showLoading, disableTextArea, selectedRoomId } = messagePanelData
  const { userInfo, showMessagePanel } = props
  const messageStyle =
    showMessagePanel == true ? "message-panel" : "message-panel hide-div"

  return (
    <div className={messageStyle}>
      <div className="show-messages">
        {showLoading == true ? (
          <Loading />
        ) : (
          messagePanelData.messages.map((message) => {
            return <Message key={message.id} {...message} userInfo={userInfo} />
          })
        )}
        <div style={{ float: "left", clear: "both" }} ref={messageEnd}></div>
      </div>
      <WriteMessage
        isDisabled={disableTextArea}
        userInfo={userInfo}
        selectedRoomId={selectedRoomId}
        stompClient={props.stompClient}
      />
    </div>
  )
}

export default MessagesPanel
