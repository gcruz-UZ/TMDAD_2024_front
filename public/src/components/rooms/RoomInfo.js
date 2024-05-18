// Constants
import Constants from "../Constants"

const RoomInfo = ({
  roomName,
  lastMessage,
  dateInfo,
  userId,
  userLogin,
  userInfoId,
  setSelectedRoomId,
  activeRoomId,
  roomId,
  onlineRooms,
  partnerId,
  read,
}) => {
  // instantiate the Constants
  const allConstants = Constants()
  const readStyle = read == false ? "last-message unread-msg" : "last-message"
  const readStyleRoomName = read == false ? "room-name unread-msg" : "room-name"
  const readStyleDateInfo = read == false ? "date-info unread-msg" : "date-info"
  const readStyleInitials = read == false ? "room-initials unread-msg" : "room-initials"
  return (
    <div
      className={activeRoomId == roomId ? "room-info active-room" : "room-info"}
      onClick={() => setSelectedRoomId(roomId, roomName)}
    >
      <div className="room-icon-div">
        <div className={readStyleInitials}>
          {roomName.substr(0, 2)}
          {onlineRooms.includes(partnerId) ? (
            <div className="online-mark"></div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className={readStyleRoomName}>
        {roomName}
        <div className={readStyle}>
          {userInfoId == userId
            ? `You: ${lastMessage.substr(0, 96)}`
            : `${userLogin}${lastMessage.length > 0 ? ":" : ""} ${lastMessage.substr(0, 100)}`}
        </div>
      </div>
      <div className={readStyleDateInfo}>{allConstants.formatDates(dateInfo)}</div>
    </div>
  )
}

export default RoomInfo
