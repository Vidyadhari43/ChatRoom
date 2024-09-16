const uniqueCode = sessionStorage.getItem('roomcode');
console.log(uniqueCode);
const username=sessionStorage.getItem('username');
const wsUrl = `wss://chatroom-fksh.onrender.com/enter_room/${uniqueCode}/${username}`;

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
    if(recv_msg.action=="file"){
        handleFile(recv_msg.file_name,recv_msg.data,recv_msg.sent_username);
    }
    else
    // (recv_msg.action=="text" || recv_msg.action=="join" || recv_msg.action=="left")
    {
        newMessage.textContent = recv_msg.sent_username+': '+recv_msg.msg;
        // use recv_msg.action 
        // action='join' for joined the chat, action='left' for left the chat, action='text' for other messages
        console.log('action: '+ recv_msg.action);
        if (recv_msg.action==='join' || recv_msg.action==='left'){
            newMessage.classList.add('centre');
        }
        if(recv_msg.sent_username===username){
            newMessage.classList.add('my-message');

        }
        else {
            newMessage.classList.add('other-messsage');
        }
        newMessage.classList.add('message');
        messagesDiv.appendChild(newMessage);
    }
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
    if (message() === "") {
        alert('Please enter a message.');
        return;
    }
    else {
        const msg={
            type:"text",
            content:message
        };
        socket.send(JSON.stringify(msg));
        messageInput.value = ''; // Clear the input box after sending
    }
});
document.getElementById('sendFileButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput').files[0];
    // const message = FileInput.files[0];
    if(!fileInput){
        alert('Please select a file.');
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        const base64Data = btoa(reader.result);
        const message = {
            type: "file",
            file_name: fileInput.name,
            data: base64Data
        };

        ws.send(JSON.stringify(message));
    };
    reader.readAsBinaryString(fileInput);
});

function handleFile(fileName, fileData, sent_username) {
    const byteCharacters = atob(fileData);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
    }
    const blob = new Blob(byteArrays, { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url); // Clean up the URL object
    console.log(`Received file: ${fileName}`);
}


