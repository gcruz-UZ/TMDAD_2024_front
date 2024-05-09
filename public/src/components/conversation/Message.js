// Constants
import Constants from "../Constants"

const Message = ({ body, timeSent, userId, filename, userInfo }) => {
  const allConstants = Constants()
	let modifiedBody = body
	let finalBody = [];
	let fileIndex = -1;
	if (filename != null && filename !== "") {
		modifiedBody = modifiedBody + "\nDOWNLOAD: " + filename
		fileIndex = modifiedBody.indexOf("DOWNLOAD");
		if (fileIndex !== -1) {
			finalBody.push(<span>{modifiedBody.substring(0, fileIndex)}</span>);
			finalBody.push(
				<span
				className="clickable-file"
				onClick={() => {
					// Handle click event for "***FILE***" here
					console.log('File clicked:', filename);
					fetch(`http://localhost:8080/api/messages/download/${filename}`, {
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
				{modifiedBody.substring(fileIndex, fileIndex + "DOWNLOAD".length)}
				</span>
			);
			finalBody.push(<span>{modifiedBody.substring(fileIndex + "DOWNLOAD".length)}</span>);
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
      {finalBody}
      <span className="time-sent">{allConstants.formatDates(timeSent)}</span>
    </div>
  )
}

export default Message
