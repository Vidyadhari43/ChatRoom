// Assuming you have the unique code available as a variable
const uniqueCode = sessionStorage.getItem('roomcode');
console.log(uniqueCode);
const username=sessionStorage.getItem('username');
const wsUrl = `ws://127.0.0.1:8000/enter_room/${uniqueCode}/${username}`;

// Initialize the WebSocket connection
const socket = new WebSocket(wsUrl);

// Event handler for connection open
socket.onopen = function(event) {
    console.log('WebSocket connection established');
};

// Event handler for receiving messages
socket.onmessage = function(event) {
    console.log('Message from server:', event.data);
    const messagesDiv = document.getElementById('messages');
    const newMessage = document.createElement('div');
    newMessage.textContent = event.data;
    messagesDiv.appendChild(newMessage);
};

// Event handler for connection close
socket.onclose = function(event) {
    console.log('WebSocket connection closed:', event);
};

// Event handler for errors
socket.onerror = function(error) {
    console.error('WebSocket error:', error);
};

// Event listener for the send button
document.getElementById('sendButton').addEventListener('click', function() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message) {
        socket.send(message);
        messageInput.value = ''; // Clear the input box after sending
    } else {
        alert('Please enter a message');
    }
});
