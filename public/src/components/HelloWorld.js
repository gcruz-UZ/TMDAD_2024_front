import { useState, useEffect } from 'react';
import Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';


import { Client } from '@stomp/stompjs';


const HelloWorld = () => {
	const [connected, setConnected] = useState(false);
	const [stompClient, setStompClient] = useState(null); // Define stompClient as a state variable

	useEffect(() => {
		// // // Create a WebSocket client
		// // const socket = new SockJS('http://localhost:8080/gs-guide-websocket');
	
		// // // Create a Stomp client over the WebSocket
		// // const stompClient = Stomp.over(socket);

		const stompClient = new Client({
			brokerURL: 'ws://localhost:8080/gs-guide-websocket',
		});

		setStompClient(stompClient); // Set the stompClient state
	
		// Define event listeners
		stompClient.onConnect = (frame) => {
		  setConnected(true);
		  console.log('Connected: ' + frame);
		  // Subscribe to topics
		  stompClient.subscribe('/topic/greetings/juan', (greeting) => {
			showGreeting(JSON.parse(greeting.body).content);
		  });
		  stompClient.subscribe('/topic/greetings/federico', (greeting) => {
			showGreeting(JSON.parse(greeting.body).content);
		  });
		};
	
		stompClient.onWebSocketError = (error) => {
		  console.error('Error with websocket', error);
		};
	
		stompClient.onStompError = (frame) => {
		  console.error('Broker reported error: ' + frame.headers['message']);
		  console.error('Additional details: ' + frame.body);
		};
	
		// Activate the Stomp client
		stompClient.activate();
	
		// Cleanup function
		return () => {
		  // Deactivate the Stomp client
		  stompClient.deactivate();
		  setConnected(false);
		  console.log("Disconnected");
		};
	  }, []); // Empty dependency array to run the effect only once on mount

	  // Function to handle greetings
		const showGreeting = (message) => {
			// Handle incoming greetings here
			console.log(message);
		};

		// Function to send name
		const sendName = () => {
			if (!stompClient) {
				console.error('Stomp client not initialized');
				return;
			  }
			  
			// Assuming you're using some form of input for the name
			const name = document.getElementById('nameInput').value;
			stompClient.publish({
			  destination: "/app/hello",
			  body: JSON.stringify({ 'name': name })
			});
		  };


	return (
	  <div>
		<div>
		<h1>Hello, World!</h1>
		<p>This is a simple HelloWorld component in React.</p>
	  </div>
	  <div>
      {/* Your component JSX */}
      {connected ? (
        <p>Connected to WebSocket</p>
      ) : (
        <p>Not connected to WebSocket</p>
      )}
      <input type="text" id="nameInput" />
      <button onClick={sendName}>Send Name</button>
    </div>
		{/* <h1>Hello, World!</h1>
		<p>This is a simple HelloWorld component in React.</p> */}
	  </div>

	  
	);
  }
  
  export default HelloWorld