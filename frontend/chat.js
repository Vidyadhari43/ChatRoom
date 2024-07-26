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
    const recv_msg=JSON.parse(event.data)
    const messagesDiv = document.getElementById('messages');
    const newMessage = document.createElement('div');
    const username = sessionStorage.getItem('username');
    newMessage.textContent = recv_msg.sent_username+': '+recv_msg.msg;
    // use recv_msg.action 
    // action='join' for joined the chat, action='left' for left the chat, action='text' for other messages
    console.log('action: '+ recv_msg.action);
    if(recv_msg.sent_username===username){
        newMessage.classList.add('my-message');

    }
    else {
        newMessage.classList.add('other-messsage');
    }
    newMessage.classList.add('message');
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
var input=document.getElementById('messageInput');
input.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("sendButton").click();
    }
  });

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


