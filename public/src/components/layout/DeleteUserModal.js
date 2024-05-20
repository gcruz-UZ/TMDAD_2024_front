// DeleteUserModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Loading from "../Loading"
import { connectKotlinBackend } from "../connectKotlinBackend"

// Constants
import Constants from "../Constants"

Modal.setAppElement('#app'); // Correctly set app element to prevent accessibility issues

const DeleteUserModal = ({ isOpen, onRequestClose, onSubmit, selectedRoomId, userLogin }) => {
  const [users, setUsers] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);
const [selectedUsers, setSelectedUsers] = useState([]);

  // instantiate the Constants
  const allConstants = Constants()

  useEffect(() => {
	const fetchUsers = async () => {
		if(!isOpen)
			return

		console.log("fetching en delete: ", selectedRoomId)
		try {
		  const config = {
			  withCredentials: true,
			  method: allConstants.method.GET,
			  url: allConstants.getKotlinUsersByRoom.replace("{id}", selectedRoomId),
			  header: allConstants.header,
			}
  
		  const response = await connectKotlinBackend(config)
		  setUsers(response.data); // Assuming the response data is an array of user objects
		} catch (error) {
		  console.error('Error fetching users:', error);
		}
	  };
  
	  fetchUsers();

    // fetch('API_URL/users')  // Replace 'API_URL' with your actual API endpoint
    //   .then(response => response.json())
    //   .then(data => setUsers(data))
    //   .catch(error => console.error('Error fetching users:', error));
  }, [isOpen]); // Fetch users only when modal opens

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => prev.includes(userId)
      ? prev.filter(id => id !== userId)
      : [...prev, userId]
    );
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSubmit(selectedUsers);
    onRequestClose(); // Close modal on submit
  };

  const handleUserSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setSelectedUsers(selectedOptions);
  };

  const requestClose = (event) => {
	event.preventDefault();
    setUsers([]);
    onRequestClose(); // Close modal on submit
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Delete Users</h2>
	  {users.length === 0 ? (
			<Loading />
		) : (
			<>
				<form onSubmit={handleFormSubmit}>
					{/* {users.map(user => (
					<div key={user.id}>
						<label>
						<input
							type="checkbox"
							checked={selectedUsers.includes(user.login)}
							onChange={() => handleUserSelect(user.login)}
						/>
						{user.login}
						</label>
					</div>
					))}
					<button type="submit">Submit</button> */}
					<div>
						<label>Select Users To Delete:</label>
						<select multiple value={selectedUsers} onChange={handleUserSelectChange}>
						{users.filter(user => user.login !== userlogin).map(user => (
							<option key={user.id} value={user.login}>{user.login}</option>
						))}
						</select>
					</div>
					<button type="submit">Delete Users</button>
					<button onClick={requestClose}>Close</button>
				</form>
			</>
		)}
    </Modal>
  );
};

export default DeleteUserModal;
