import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Loading from "../Loading"
import axios from 'axios';
import { connectKotlinBackend } from "../connectKotlinBackend"

// Constants
import Constants from "../Constants"

// Check if the document is available (component runs in a browser environment)
if (typeof document !== 'undefined') {
  Modal.setAppElement('#app');
}

const CreateChatRoom = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [name, setRoomName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [resultMessage, setResultMessage] = useState('');

  // instantiate the Constants
  const allConstants = Constants()
  const fetchUsers = async () => {
	try {
	  const config = {
		  withCredentials: true,
		  method: allConstants.method.GET,
		  url: allConstants.getKotlinUsers,
		  header: allConstants.header,
		}

	  const response = await connectKotlinBackend(config)
	  setUsers(response.data); // Assuming the response data is an array of user objects
	} catch (error) {
	  console.error('Error fetching users:', error);
	}
  };

  // Fetch users from backend when component mounts
  useEffect(() => {
	// console.log("ABIERTO 1")
    // fetchUsers();
  }, []);

  const openModal = () => {
	fetchUsers();
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
	setUsers([]);
    setResultMessage('');
  };

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
  };

  const handleUserSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setSelectedUsers(selectedOptions);
  };

  const handleSubmit = async (e) => {
	setResultMessage(``)
    e.preventDefault();
    try {
		const config = {
			withCredentials: true,
			method: allConstants.method.POST,
			url: allConstants.createKotlinRoom,
			header: allConstants.header,
			data: { name, users: [...selectedUsers, userlogin] },
		  }
      const response = await connectKotlinBackend(config)
      setResultMessage(`Creada! Puedes cerrar y comenzar a hablar, o crear otra room si lo prefieres.`/* + ' ${response.data.message}'*/ );
    } catch (error) {
      setResultMessage(`Error creando la room: ${error.response.data.message}`);
    }
  };

  const { userlogin } = props

  return (
    <div>
      <span onClick={openModal} style={{ cursor: 'pointer', color: 'white', textDecoration: 'underline', marginLeft: '20px' }}>Create New Chat Room</span>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal" overlayClassName="overlay">
        <h2>Create New Chat Room</h2>
		{users.length === 0 ? (
			<Loading />
		) : (
			<>
				<form onSubmit={handleSubmit}>
				<div>
					<label>Room Name:</label>
					<input type="text" value={name} onChange={handleRoomNameChange} required />
				</div>
				<div>
					<label>Select Users:</label>
					<select multiple value={selectedUsers} onChange={handleUserSelectChange}>
					{users.filter(user => user.login !== userlogin).map(user => (
						<option key={user.id} value={user.login}>{user.login}</option>
					))}
					</select>
				</div>
				<button type="submit">Create Room</button>
				</form>
				{resultMessage && <p><strong>{resultMessage}</strong></p>}
				<button onClick={closeModal}>Close</button>
			</>
		)}
      </Modal>
    </div>
  );
};

export default CreateChatRoom;

