// Constants
import Constants from "../Constants"

const Message = ({ id, body, timeSent, userId, userLogin, filename, userInfo }) => {
  const allConstants = Constants()
	let modifiedBody = body.length == 0 ? body : body + "\n"
	let finalBody = [];
	let fileIndex = -1;
	if (filename != null && filename !== "") {
		modifiedBody = modifiedBody + "Click to download file: " + filename
		fileIndex = modifiedBody.indexOf("Click to download file");
		if (fileIndex !== -1) {
			finalBody.push(<span>{modifiedBody.substring(0, fileIndex)}</span>);
			finalBody.push(
				<span
				className="clickable-file"
				onClick={() => {
					// Handle click event for "***FILE***" here
					console.log('File clicked:', filename);
					// fetch(`http://localhost:8080/api/messages/download/${filename}`, {
					// 	credentials: 'include'  // Include cookies with the request
					// })
					// 	.then(response => response.blob())
					// 	.then(blob => {
					// 		// Create a new URL for the blob and open it in a new tab/window
					// 		const url = window.URL.createObjectURL(blob);
					// 		const link = document.createElement('a');
					// 		link.href = url;
					// 		link.setAttribute('download', filename);
					// 		document.body.appendChild(link);
					// 		link.click();
					// 		link.parentNode.removeChild(link);
					// 		window.URL.revokeObjectURL(url);  // Clean up the URL object
					// 	})
					// 	.catch(error => console.error('Error downloading the file:', error));
					fetch(`http://localhost:8080/api/messages/${id}/download`, {
						credentials: 'include'  // Include cookies with the request
					})
						.then(response => response.blob())
						.then(blob => {
							// Create a new URL for the blob and open it in a new tab/window
							const url = window.URL.createObjectURL(blob);
							const link = document.createElement('a');
							link.href = url;
							link.setAttribute('download', filename);
							document.body.appendChild(link);
							link.click();
							link.parentNode.removeChild(link);
							window.URL.revokeObjectURL(url);  // Clean up the URL object
						})
						.catch(error => console.error('Error downloading the file:', error));
				}}
				>
				{modifiedBody.substring(fileIndex, fileIndex + "Click to download file".length)}
				</span>
			);
			finalBody.push(<span>{modifiedBody.substring(fileIndex + "Click to download file".length)}</span>);
		} else {
			finalBody.push(<span>{modifiedBody}</span>);
		}
	} else {
		finalBody.push(<span>{modifiedBody}</span>);
	}

  return (
    <div
      className={userId == userInfo.id ? "msg my-msg" : "msg room-msg"}
    >
	  {/* {userId == userInfo.id ? "" : userLogin+":\n"} */}
	  {userId == userInfo.id ? "" : <strong>{userLogin+":\n"}</strong>}
      {finalBody}
      <span className="time-sent">{allConstants.formatDates(timeSent)}</span>
    </div>
  )
}

export default Message
