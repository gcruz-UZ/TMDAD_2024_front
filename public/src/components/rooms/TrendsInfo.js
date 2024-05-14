import { useEffect, useState } from "react"
// Constants
import Constants from "../Constants"

const TrendsInfo = (props) => {

	// instantiate the Constants
	const allConstants = Constants()

	const [activeRoomId, setActiveRoomId] = useState(props.selectedRoomId)
	  // pass the selected room id augmented with logged in userid to the parent
	  const setSelectedRoomId = (id) => {
		props.setSelectedRoomId(id, "")
		// set active room id for highlighting purpose
		setActiveRoomId(id)
	  }

	  useEffect(() => {
		if(props.selectedRoomId > 0 || props.selectedRoomId == allConstants.statsId)
		{
			setActiveRoomId(props.selectedRoomId)
		}
	  })

	const readStyle = props.read == false ? "last-message unread-msg" : "last-message"

	return (
		<div>
			<div
				className={activeRoomId == props.roomId ? "trending-info active-room" : "trending-info"}
				// onClick={() => setSelectedRoomId(roomId)
				onClick={() => setSelectedRoomId(props.roomId)
				}
			>
				<div className="room-icon-div">
					<div className="trending-initials">
						{props.roomName.substr(0, 2)}
						{props.onlineRooms.includes(props.partnerId) ? (
						<div className="online-mark"></div>
						) : (
						""
						)}
					</div>
				</div>
				<div className="trending-name">
					{props.roomName}
					{/* <div className={readStyle}>
						{userInfo == userId
						? `You: ${lastMessage.substr(0, 96)}`
						: lastMessage.substr(0, 100)}
					</div> */}
				</div>
				{/* <div className="date-info">{allConstants.formatDates(dateInfo)}</div> */}
				<div className="room-icon-div">
					<div className="trending-initials">
						{props.roomName.substr(0, 2)}
						{props.onlineRooms.includes(props.partnerId) ? (
						<div className="online-mark"></div>
						) : (
						""
						)}
					</div>
				</div>
			</div>
		</div>
	)
  }

export default TrendsInfo
