import { useState } from "react"

// components
import ErrorMessage from "./ErrorMessage"
import SuccessMessage from "./SuccessMessage"
import Loading from "../Loading"

// Constants
import Constants from "../Constants"
import { connectBackend } from "../connectBackend"
import { connectKotlinBackend } from "../connectKotlinBackend"

const Login = (props) => {
  // Initialize the initial state and its modifier function
  const [loginData, setLoginData] = useState({
    showPasswordInput: false,
    showError: false,
	showSuccess: false,
    username: "",
    password: "",
    errorMessage: "Incorrect Credentials",
    successMessage: "Correct Credentials!",
    showLoading: false,
  })

  // instantiate the Constants
  const allConstants = Constants()

  // handle when the username / password field is updated
  const handleOnChange = (e) => {
    // update the corresponding state values
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
  }

  // handle when the ENTER key is pressed
  const handleKeyPress = (e) => {
    if (e.keyCode == 13 || e.which == 13) {
      // if username is entered enter the password
      if (loginData.username && loginData.password) {
        console.log("Everything is correct Go for verify...", loginData)
        verifyUser()
      } else if (loginData.username) {
        setLoginData({ ...loginData, showPasswordInput: true })
      } else {
        showErrorComponent()
      }
    }
  }

  // verify the logged in user
  const verifyUser = async () => {
    const { username, password, showLoading } = loginData

    // reset the username / password field
    setLoginData({
      ...loginData,
      password: "",
      username: "",
      showLoading: true,
    })

	try {
		// // //Antiguo (El server de REACK)
		// //   const config = {
		// //     method: allConstants.method.POST,
		// //     url: allConstants.login,
		// //     header: allConstants.header,
		// //     data: { username, password },
		// //   }

		// // console.log("CONNECTING BACKEND 1")
      	// // const res = await connectBackend(config)
	  	// // console.log("CONNECTING BACKEND 2")

		const config = {
			withCredentials: true,
			method: allConstants.method.POST,
			// url: allConstants.kotlinLogin,
			url: allConstants.kotlinSignin,
			header: allConstants.header,
			data: { username, password },
		}		

		//NUEVO: el nuestro, el de KOTLIN
		console.log("CONNECTING KOTLIN BACKEND 1")
		const res = await connectKotlinBackend(config)
		console.log("CONNECTING KOTLIN BACKEND 2")

		if (res.data.login) {
			console.log("user authentication successful", res.data)
			setLoginData({ ...loginData, showLoading: false })

			showSuccessComponent()
			// // // // console.log("OE OE OE OE OE OE")
			// // // // console.log(res.data.token)
			// // // // console.log("OE OE OE OE OE OE")
			// // // // // // // reload the page
			// // // // // // setTimeout(() => {
			// // // // // // 	location.reload()
			// // // // // // }, 2000)

			// send the logged in user's data to parent
			props.onSuccessLogin(res.data)
		} else {
			// show the error message
			showErrorComponent()

			// reload the page
			setTimeout(() => {
				location.reload()
			}, 2000)
		}
	} catch (err) {
		console.log("EXCEPTION IN LOGIN...", err)
		showErrorComponent()

		// reload the page
		setTimeout(() => {
			location.reload()
		}, 2000)
	}
  }

  const showErrorComponent = () => {
    // show the error message component
    setLoginData({ ...loginData, showError: true })

    // hide the error message component after 2sec
    setTimeout(() => {
      setLoginData({ ...loginData, showError: false 
	})
    }, 2000)
  }

  const showSuccessComponent = () => {
    // show the error message component
    setLoginData({ ...loginData, showSuccess: true })

    // hide the error message component after 2sec
    setTimeout(() => {
      setLoginData({ ...loginData, showSuccess: false 
	})
    }, 2000)
  }

  const {
    showError,
	showSuccess,
    showPasswordInput,
    showLoading,
    errorMessage,
	successMessage,
    username,
    password,
  } = loginData
  return (
    <div className="login">
      <div className="login-form">
        <div className="login-title">Login</div>
        {showError == true && <ErrorMessage message={errorMessage} />}
        {showSuccess == true && <SuccessMessage message={successMessage} />}

        {showLoading == true ? (
          <Loading />
        ) : showPasswordInput == false ? (
          <input
            type="text"
            placeholder="Enter username"
            onChange={handleOnChange}
            onKeyPress={handleKeyPress}
            name="username"
            value={username}
          />
        ) : (
          <input
            type="password"
            placeholder="Enter password"
            onChange={handleOnChange}
            onKeyPress={handleKeyPress}
            name="password"
            value={password}
          />
        )}
      </div>
    </div>
  )
}

export default Login
