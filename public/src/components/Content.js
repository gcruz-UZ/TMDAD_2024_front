import { useEffect, useState } from "react"
import { Client } from '@stomp/stompjs';

// components
import RoomPanel from "./rooms/RoomPanel"
import MessagesPanel from "./conversation/MessagesPanel"

const Content = (props) => {
  // Initialize the initial data and its modifier
  const [contentData, setContentData] = useState({
    showMessagePanel: true,
    showRoomPanel: true,
    onlineRooms: [],
  })

   // Define stompClient as a state variable
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);

// // // //   const socket = io()
  useEffect(() => {
    toggleMessagePanel(false, true)
    // onConnect()
    // onUserOnline()
    // onMessageArrival()

	const stompClient = new Client({
		brokerURL: 'ws://localhost:8080/ws',
	});

	// Set the stompClient state
	setStompClient(stompClient);

	// Define event listeners
	stompClient.onConnect = (frame) => {
		setConnected(true);
		console.log('Connected: ' + frame);
		console.log("onlineUser", props.userInfo.id)
		stompClient.subscribe('/topic/messages/' + props.userInfo.login, (greeting) => {
			fillRoomInfoFromSocket(JSON.parse(greeting.body))
		});
	};

	stompClient.onWebSocketError = (error) => {
		console.error('Error with websocket', error);
	};

	stompClient.onStompError = (frame) => {
		console.error('Broker reported error: ' + frame.headers['message']);
		console.error('Additional details: ' + frame.body);
	};

	// Activate the Stomp client
	stompClient.activate();

	// Cleanup function
	return () => {
		// Deactivate the Stomp client
		stompClient.deactivate();
		setConnected(false);
		console.log("Disconnected");
	};
  }, []) // Empty dependency array to run the effect only once on mount

//   // connect to the socket
//   const onConnect = () => {
//     socket.on("connect", () => {
//       console.log("Socket connected FROM React...")
// 	  console.log("onlineUser", props.userInfo.id)
//       // emit all the room ids where the user belongs to see him / her as active
//       socket.emit("onlineUser", props.userInfo.id)
//     })
//   }

// // // // // // // // // // // // // // // // // // // // // // // //   // when a user is online
// // // // // // // // // // // // // // // // // // // // // // // //   const onUserOnline = () => {
// // // // // // // // // // // // // // // // // // // // // // // //     socket.on("onlineUser", (data) => {
// // // // // // // // // // // // // // // // // // // // // // // //       if (data && data.length > 0) {
// // // // // // // // // // // // // // // // // // // // // // // //         console.log("these rooms should be shown as online", data)
// // // // // // // // // // // // // // // // // // // // // // // //         notifyOnlineRooms(data)
// // // // // // // // // // // // // // // // // // // // // // // //       }
// // // // // // // // // // // // // // // // // // // // // // // //     })
// // // // // // // // // // // // // // // // // // // // // // // //   }

//   // when a new message arrives through socket
//   const onMessageArrival = () => {
//     socket.on("message", (data) => {
//       console.log("data value arrives from socket", data)
//       fillRoomInfoFromSocket(data)
//     })
//   }

//   // when the socket disconnects
//   socket.on("disconnect", () => {
//     console.log("SOCKET is disconnected.. .!!")
//   })

  const toggleMessagePanel = (showMessagePanel, showRoomPanel) => {
    if (window.innerWidth < 500) {
      setContentData({ ...contentData, showMessagePanel, showRoomPanel })
      if (showMessagePanel == true) {
        props.toggleBackButton(true)
      }
    }
  }

  const setSelectedRoomId = (id) => {
    toggleMessagePanel(true, false)
    // set in the corresponding variable
    setContentData({ ...contentData, selectedRoomId: id })
  }

  const fillRoomInfoFromSocket = (message) => {
    setContentData({ ...contentData, newMessageFromSocket: message })
  }

  const notifyOnlineRooms = (rooms) => {
    setContentData({ ...contentData, onlineRooms: rooms })
  }

  const { userInfo } = props
  let {
    showMessagePanel,
    showRoomPanel,
    selectedRoomId,
    newMessageFromSocket,
    onlineRooms,
  } = contentData

  if (window.innerWidth < 500 && props.showBackButton == false) {
    showMessagePanel = false
    showRoomPanel = true
  }

  return (
    <div className="content">
      <RoomPanel
        showRoomPanel={showRoomPanel}
        userInfo={userInfo}
        onlineRooms={onlineRooms}
        newMessageFromSocket={newMessageFromSocket}
        selectedRoomId={selectedRoomId}
        setSelectedRoomId={setSelectedRoomId}
      />

      <MessagesPanel
        showMessagePanel={showMessagePanel}
        selectedRoomId={selectedRoomId}
        newMessageFromSocket={newMessageFromSocket}
        notifyOnlineRooms={notifyOnlineRooms}
        // socket={socket}
        stompClient={stompClient}
        userInfo={userInfo}
      />
    </div>
  )
}

export default Content
