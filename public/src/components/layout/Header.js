// components
import Title from "./Title"
import UserGreeting from "./UserGreeting"
import CreateChatRoom from './CreateChatRoom';

export default ({ userInfo }) => {
  return (
    <div className="header">
	  <link rel="shortcut icon" href="#"></link>
      <Title />
	  <div className="create-room-container">
	  {userInfo && <CreateChatRoom userlogin={userInfo.login}/>}
      </div>
      {userInfo && <UserGreeting username={userInfo.name} />}
    </div>
  )
}
