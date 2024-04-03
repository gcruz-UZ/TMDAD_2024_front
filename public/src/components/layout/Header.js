// components
import Title from "./Title"
import UserGreeting from "./UserGreeting"

export default ({ userInfo }) => {
  return (
    <div className="header">
	  <link rel="shortcut icon" href="#"></link>
      <Title />
      {userInfo && <UserGreeting username={userInfo.name} />}
    </div>
  )
}
