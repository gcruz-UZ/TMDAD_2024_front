import { useEffect, useState } from "react"

// components
import RoomInfo from "./RoomInfo"
import Loading from "../Loading"

// Constants
import Constants from "../Constants"
import { connectBackend } from "../connectBackend"
import { connectKotlinBackend } from "../connectKotlinBackend"

const RoomPanel = (props) => {
  // Initialize the initial state and its modifier function
  const [roomPanelData, setRoomPanelData] = useState({
    rooms: [],
    showLoading: true,
  })
  const [lastMsgFromSocketId, setLastMsgFromSocketId] = useState("")
  const [lastRoomFromSocketId, setLastRoomFromSocketId] = useState("")
  const [lastRemovedRoomFromSocketId, setLastRemovedRoomFromSocketId] = useState("")
  const [shouldLoadrooms, setShouldLoadRooms] = useState(true)
  const [activeRoomId, setActiveRoomId] = useState(props.selectedRoomId)
  // instantiate the Constants
  const allConstants = Constants()

  useEffect(() => {
	//Solo actualizamos si se trata del de trends o stats, porque si no, se iba constantemente
	if(props.selectedRoomId == allConstants.trendingsId || props.selectedRoomId == allConstants.statsId)
	{
		setActiveRoomId(props.selectedRoomId)
	}
	loadrooms()
    onMessageArrival()
  })

  const onMessageArrival = () => {
    if (
      props.newMessageFromSocket &&
      props.newMessageFromSocket.id !== lastMsgFromSocketId
    ) {
      const { roomId, body, filename, timeSent, userId, userLogin, id } =
        props.newMessageFromSocket
    //   console.log(
    //     "props is here",
    //     id,
    //     " and roomPanelData",
    //     lastMsgFromSocketId
    //   )

      // avoid repeated loading of rooms and save the last message id from socket
      setShouldLoadRooms(false)
      setLastMsgFromSocketId(id)

      roomPanelData.rooms.map((room) => {
        if (room.roomId == roomId) {
          // adjust the necessary field if the roomId matches
          room.lastMessage = (body.length == 0 && filename.length > 0) ? "(file)" : body
          room.dateInfo = timeSent
          room.lastMessageTime = timeSent
          room.userId = userId
          room.userLogin = userLogin

          // if the message is from other non active room
          if (room.read == true && room.roomId !== activeRoomId) {
            room.read = false
            // saveReadStatusToDb(room, false)
          }
        }
      })

	  roomPanelData.rooms.sort((a, b) => {
        return new Date(b.dateInfo) - new Date(a.dateInfo)
      })
    }
  }

  // call the back end to get rooms
  const loadrooms = async () => {
    if (shouldLoadrooms == true) {
      try {
        // const config = {
        //   method: allConstants.method.POST,
        //   url: allConstants.getRooms.replace("{id}", props.userInfo.id),
        //   header: allConstants.header,
        //   data: { rooms: props.userInfo.rooms },
        // }

        // const res = await connectBackend(config)
		
        // sort the data based on dates
        // res.data = res.data.sort((a, b) => {
        //   return new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        // })
		props.userInfo.rooms = props.userInfo.rooms.sort((a, b) => {
			return new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
		  })

		//Obtenemos ultimo mensaje publi
		const config = {
			withCredentials: true,
			method: allConstants.method.GET,
			url: allConstants.getKotlinLastAd,
			header: allConstants.header,
		}
	
		const res = await connectKotlinBackend(config)

		if(res.data)
			{
				console.log("hay")
			}
			else
			{
				console.log("es empty")

			}

		//Añadimos la de publi
		const output = [{
			isAd: true,
			roomName: "PUBLICIDAD",
			roomId: allConstants.adId,
			// lastMessage: ele.lastMessage ? ele.lastMessage.body : [],
			lastMessage: res.data ? ((res.data.body.length == 0 && res.data.filename.length > 0) ? "(file)" : res.data.body) : "",
			// dateInfo: ele.lastMessage ? ele.lastMessage.timeSent : "NA",
			dateInfo: res.data ? res.data.timeSent : "NA",
			// userId: ele.lastMessage ? ele.lastMessage.userId : "NA",
			userId: res.data ? res.data.userLogin : "NA",
			// partnerId: rooms[index].partnerId || "NA",
			partnerId: "NA",
			// read: rooms[index].read,
			read: res.data ? res.data.timeSent < props.userInfo.lastSignIn : false,
		}]

		if (props.userInfo.rooms.length > 0) {
			props.userInfo.rooms.forEach((ele, index) => {
				output.push({
					isAd: false,
					roomName: ele.name,
					roomId: ele.id,
					// lastMessage: ele.lastMessage ? ele.lastMessage.body : [],
					lastMessage: ele.lastMessage ? ((ele.lastMessage.body.length == 0 && ele.lastMessage.filename.length > 0) ? "(file)" : ele.lastMessage.body) : "",
					// dateInfo: ele.lastMessage ? ele.lastMessage.timeSent : "NA",
					// dateInfo: ele.lastMessage ? ele.lastMessage.timeSent : "NA",
					dateInfo: ele.lastMessageTime,
					// userId: ele.lastMessage ? ele.lastMessage.userId : "NA",
					userId: ele.lastMessage ? ele.lastMessage.userId : "NA",
					userLogin: ele.lastMessage ? ele.lastMessage.userLogin : "",
					// partnerId: rooms[index].partnerId || "NA",
					partnerId: "NA",
					// read: rooms[index].read,
					// read: ele.lastMessage ? ele.lastMessageTime < props.userInfo.lastSignIn : false,
					read: ele.lastMessage ? ele.lastMessageTime < ele.userLastAccess : false,
				})
			})
		}

        // set necessary state variables
        setRoomPanelData((prevState) => {
        // //   return { ...prevState, rooms: res.data, showLoading: false }
          return { ...prevState, rooms: output, showLoading: false }
        })
        setShouldLoadRooms(false)
      } catch (err) {
        console.log("some error occurred....", err)
      }
    }

	if(props.newRoomFromSocket && props.newRoomFromSocket.id !== lastRoomFromSocketId)
	{
		if(props.newRoomFromSocket.id === lastRemovedRoomFromSocketId)
		{
			setLastRemovedRoomFromSocketId("")
		}

		console.log(props.newRoomFromSocket)
		setLastRoomFromSocketId(props.newRoomFromSocket.id)
		roomPanelData.rooms.push({
			roomName: props.newRoomFromSocket.name,
			roomId: props.newRoomFromSocket.id,
			// lastMessage: ele.lastMessage ? ele.lastMessage.body : [],
			lastMessage: props.newRoomFromSocket.lastMessage ? ((props.newRoomFromSocket.lastMessage.body.length == 0 && props.newRoomFromSocket.lastMessage.filename.length > 0) ? "(file)" : props.newRoomFromSocket.lastMessage.body) : "",
			// dateInfo: ele.lastMessage ? ele.lastMessage.timeSent : "NA",
			// dateInfo: props.newRoomFromSocket.lastMessage ? props.newRoomFromSocket.lastMessage.timeSent : "NA",
			dateInfo: props.newRoomFromSocket.lastMessageTime ? props.newRoomFromSocket.lastMessageTime : "NA",
			// userId: ele.lastMessage ? ele.lastMessage.userId : "NA",
			userId: props.newRoomFromSocket.lastMessage ? props.newRoomFromSocket.lastMessage.userId : "NA",
			userLogin: props.newRoomFromSocket.lastMessage ? props.newRoomFromSocket.lastMessage.userLogin : "",
			// partnerId: rooms[index].partnerId || "NA",
			partnerId: "NA",
			// read: rooms[index].read,
			read: false,
		})

		roomPanelData.rooms.sort((a, b) => {
			return new Date(b.dateInfo) - new Date(a.dateInfo)
		  })
	}

	if(props.removedRoomFromSocket && props.removedRoomFromSocket.id !== lastRemovedRoomFromSocketId)
	{
		if(props.removedRoomFromSocket.id === lastRoomFromSocketId)
		{
			setLastRoomFromSocketId("")
		}

		setLastRemovedRoomFromSocketId(props.removedRoomFromSocket.id)
		roomPanelData.rooms = roomPanelData.rooms.filter(room => room.roomId != props.removedRoomFromSocket.id)
	}
  }
  // pass the selected room id augmented with logged in userid to the parent
  const setSelectedRoomId = (id, name) => {
    props.setSelectedRoomId(id, name)
    // set active room id for highlighting purpose
    setActiveRoomId(id)
    changeReadStatus(id)
  }

  // function to change the room status from read / unread
  const changeReadStatus = (id) => {
    const allRooms = [...roomPanelData.rooms]

    allRooms.forEach((room, index, roomArray) => {
      if (room.roomId == id && room.read == false) {
        roomArray[index].read = true
        // saveReadStatusToDb(room, true)
      }
    })

    setRoomPanelData({ ...roomPanelData, rooms: allRooms })
  }

//   const saveReadStatusToDb = async (room, status) => {
//     try {
//       const config = {
//         method: allConstants.method.PUT,
//         url: allConstants.saveReadStatus,
//         data: {
//           id: props.userInfo.id,
//           roomName: room.roomName,
//           read: status,
//         },
//       }
//       await connectBackend(config)
//     } catch (err) {
//       console.log("unable to save room status", err)
//     }
//   }

  const { userInfo, showRoomPanel, onlineRooms } = props
  const { showLoading, rooms } = roomPanelData

//   const roomStyle =
//     showRoomPanel == false ? "rooms-panel hide-div" : "rooms-panel"

  	let roomStyle
  	if(userInfo.isSuperUser)
	{
		roomStyle =
    		showRoomPanel == false ? "rooms-panel-superuser hide-div" : "rooms-panel-superuser"
	}
	else
	{
		roomStyle =
    		showRoomPanel == false ? "rooms-panel hide-div" : "rooms-panel"
	}
  return (
    <div className={roomStyle}>
      {showLoading == true ? (
        <Loading />
      ) : (
        rooms.map((room) => {
			// console.log(room.roomId)
          return (
            <RoomInfo
              key={room.roomId}
              {...room}
              userInfoId={userInfo.id}
              activeRoomId={activeRoomId}
              onlineRooms={onlineRooms}
              setSelectedRoomId={setSelectedRoomId}
            />
          )
        })
      )}
    </div>
  )
}

export default RoomPanel
