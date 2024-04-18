// Constants
import Constants from "../Constants"

const Message = ({ body, timeSent, userId, userInfo }) => {
  const allConstants = Constants()
  return (
    <div
      className={userId == userInfo.id ? "msg my-msg" : "msg room-msg"}
    >
      {body}
      <span className="time-sent">{allConstants.formatDates(timeSent)}</span>
    </div>
  )
}

export default Message
