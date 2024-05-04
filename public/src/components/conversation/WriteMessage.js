import { useState } from "react"
// import { v4 as uuidv4 } from "uuid"

const WriteMessage = (props) => {
  // Initialize the initial state and its modifier function
  const [writeMessageData, setWriteMessageData] = useState({ message: "" })

  // initialize the socket
  const stompClient = props.stompClient

  // if the ENTER key is pressed emit the message
  const sendMessage = (e) => {
    if ((e.keyCode == 13 || e.which == 13) && !e.ctrlKey) {
      // emit the message
      if (writeMessageData.message.length > 0) {
		stompClient.publish({
			destination: "/app/message",
			body: JSON.stringify({
				'body': writeMessageData.message, 
				'userId': props.userInfo.id, 
				'roomId': props.selectedRoomId})
		});
      }

      // reset the textarea value
      setWriteMessageData({ ...writeMessageData, message: "" })
    } else if ((e.keyCode == 13 || e.which == 13) && e.ctrlKey) {
      console.log("CTRL pressed")
      setWriteMessageData({
        ...writeMessageData,
        message: e.target.value + "\n",
      })
    }
  }

  const handleChange = (e) => {
    setWriteMessageData({ ...writeMessageData, message: e.target.value })
  }

  return (
    <textarea
      rows="3"
      className="msg-write-div"
      disabled={props.isDisabled}
      onChange={handleChange}
      onKeyPress={sendMessage}
      value={writeMessageData.message}
    />
  )
}

export default WriteMessage
