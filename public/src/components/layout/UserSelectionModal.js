// UserSelectionModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { connectKotlinBackend } from "../connectKotlinBackend"

// Constants
import Constants from "../Constants"

Modal.setAppElement('#app'); // Correctly set app element to prevent accessibility issues

const UserSelectionModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // instantiate the Constants
  const allConstants = Constants()

  useEffect(() => {
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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Select Users</h2>
      <form onSubmit={handleFormSubmit}>
        {users.map(user => (
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
        <button type="submit">Submit</button>
      </form>
    </Modal>
  );
};

export default UserSelectionModal;
