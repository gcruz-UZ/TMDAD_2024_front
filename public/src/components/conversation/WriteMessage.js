import { useState } from "react"
import { connectKotlinBackend } from "../connectKotlinBackend"
// import { v4 as uuidv4 } from "uuid"

// Constants
import Constants from "../Constants"

const WriteMessage = (props) => {
  // Initialize the initial state and its modifier function
  const [writeMessageData, setWriteMessageData] = useState({ message: "" })
  const [file, setFile] = useState(null);

  // initialize the socket
  const stompClient = props.stompClient

  const allConstants = Constants()

  // if the ENTER key is pressed emit the message
  const sendMessage = (e) => {
    if ((e.keyCode == 13 || e.which == 13) && !e.ctrlKey) {
      // emit the message
      if (writeMessageData.message.length > 0 || file != null) {
		let filename = ""

		if(file != null)
		{
			filename = file.name
			const formData = new FormData();
        	formData.append("file", file);
        	formData.append("body", writeMessageData.message);
        	formData.append("filename", filename);
        	formData.append("isAd", props.selectedRoomId == allConstants.adId);
        	formData.append("userId", props.userInfo.id);
        	formData.append("userLogin", props.userInfo.login);
        	formData.append("roomId", props.selectedRoomId == allConstants.adId ? null : props.selectedRoomId);

			const config = {
				withCredentials: true,
				method: allConstants.method.POST,
				url: allConstants.uploadFile,
				data: formData,
				header: {"Content-Type": "multipart/form-data"},
			  }
		
			connectKotlinBackend(config)

			setFile(null)
		}
		else
		{
			//Mensaje normal, mandamos simplemente por websocket
			stompClient.publish({
				destination: "/app/message",
				body: JSON.stringify({
					'body': writeMessageData.message, 
					'filename': filename,
					'isAd': props.selectedRoomId == allConstants.adId,
					'userId': props.userInfo.id,
					'userLogin': props.userInfo.login,
					'roomId': props.selectedRoomId == allConstants.adId ? null : props.selectedRoomId})
			});
		}

		// // // // // // // // fetch(`http://localhost:8080/api/messages/download/document.pdf`, {
		// // // // // // // // 	credentials: 'include'  // Include cookies with the request
		// // // // // // // // })
		// // // // // // // // 	.then(response => response.blob())
		// // // // // // // // 	.then(blob => {
		// // // // // // // // 		// Create a new URL for the blob and open it in a new tab/window
		// // // // // // // // 		const url = window.URL.createObjectURL(blob);
		// // // // // // // // 		const link = document.createElement('a');
		// // // // // // // // 		link.href = url;
		// // // // // // // // 		link.setAttribute('download', "document.pdf");
		// // // // // // // // 		document.body.appendChild(link);
		// // // // // // // // 		link.click();
		// // // // // // // // 		link.parentNode.removeChild(link);
		// // // // // // // // 		window.URL.revokeObjectURL(url);  // Clean up the URL object
		// // // // // // // // 	})
		// // // // // // // // 	.catch(error => console.error('Error downloading the file:', error));




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
	if(e.target.value.length > 500)
	{
		alert("No se permiten mensajes superiores a 500 caracteres de longitud");
		return
	}

	if(e.target.value == "\n")
	{
		return
	}

	setWriteMessageData({ ...writeMessageData, message: e.target.value })
  }

  

	const onFileChange = event => {
		if((event.target.files[0].size / (1024*1024)) > 20)
		{
			alert("No se permiten archivos superiores a 20MB de tamaño");
			event.target.value = ''
			return
		}
		
		setFile(event.target.files[0]);
		// console.log(event.target.files[0]);
	};

	const onInputClick = (event) => {
		event.target.value = ''
	}

	const onFileUpload = () => {
        const formData = new FormData();
        formData.append("file", file);

        // axios.post("http://localhost:8080/upload", formData, {
        //     headers: {
        //         "Content-Type": "multipart/form-data"
        //     }
        // })
        // .then(response => console.log('File uploaded successfully'))
        // .catch(error => console.error('Error uploading file', error));
    };

let buttonFilenameText = file != null ? ": " + file.name : ""

  return (
	<div className="chat-input-container">
		<label className="file-upload-button">
			Upload File{buttonFilenameText}
			<input type="file" className="file-upload-input" onClick={onInputClick} onChange={onFileChange} style={{display: 'none'}} />
		</label>
		<textarea
			rows="3"
			className="msg-write-div"
			disabled={(props.selectedRoomId == allConstants.adId && !props.userInfo.isSuperUser) ? true : props.isDisabled}
			onChange={handleChange}
			onKeyPress={sendMessage}
			value={writeMessageData.message}
			/>

		{/* <input type="file" onChange={onFileChange} rows="3"
			className="msg-adj-div"/>
		<button onClick={onFileUpload}>
			Upload!
		</button> */}
	</div>
  )
}

export default WriteMessage
