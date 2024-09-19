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
    // const username = sessionStorage.getItem('username');
    if(recv_msg.action=="file"){
        const newMessage = document.createElement('div');
        handleFile(recv_msg.file_name,recv_msg.data,recv_msg.sent_username);
        // newMessage.textContent = recv_msg.sent_username+': '+recv_msg.file_name;
    }
    else if(recv_msg.action=="call"){
        const newElement=document.createElement('button');
        newElement.id='accept';
        newElement.textContent=`call started by ${recv_msg.sent_username}`;
        newElement.onclick = accept_vc; // Assign the function reference without parentheses
        messagesDiv.appendChild(newElement);
        if(recv_msg.sent_username==username){
            window.location.href='/frontend/call.html';
        }
    }
    else
    // (recv_msg.action=="text" || recv_msg.action=="join" || recv_msg.action=="left")
    {
        const newMessage = document.createElement('div');
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
    if (message.trim() === "") {
        alert('Please enter a message.');
        return;
    }
    else {
        console.log('message sent- ',message);
        const msg={
            type:"text",
            content:message
        };
        socket.send(JSON.stringify(msg));
        messageInput.value = ''; // Clear the input box after sending
    }
});
document.getElementById('clip').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const box = document.getElementById('pop_up');
    
    // Wait for the file to be selected by checking the file input change event
    fileInput.addEventListener('change', function() {
        const uploadedFile = fileInput.files[0];
        
        // If no file is uploaded, show an alert and exit
        if (!uploadedFile) {
            alert('No file selected.');
            return;
        }
        document.getElementById('pop_up').style.display='block';
        // Once a file is selected, display the new div and button
       // alert('File is uploaded!');
        
    //     const newDiv = document.createElement('div');
    //     newDiv.id = 'textDiv';
    //     newDiv.style.marginLeft='0px';
    //     newDiv.style.marginTop='175px';
    //     newDiv.style.marginRight='100 px';
    //     // Add some text to the div
    //     const text = document.createElement('p');
    //     text.innerText = 'File is uploaded!';
    //     newDiv.appendChild(text);
    
    //     // Create a new button and append it to the div
    //     const newButton = document.createElement('button');
    //     newButton.innerText = 'Send';
    //     newButton.style.backgroundColor = 'rgb(126, 126, 251)';
    //     newButton.style.color = 'white';
    //     newButton.style.padding = '5px 15px';
    //     newButton.style.border = 'none';
    //     newButton.style.borderRadius = '5px';
        
    //    // button.className = 'button-style'
    //     newButton.onclick = function() {
    //        // alert('New button clicked!');
    //         const fileInput = document.getElementById('fileInput').files[0];
    //         if(!fileInput){
    //             alert('Please select a file.');
    //             return;
    //         }
    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             const base64Data = btoa(reader.result);
    //             const message = {
    //                 type: "file",
    //                 file_name: fileInput.name,
    //                 data: base64Data
    //             };
        
    //             socket.send(JSON.stringify(message));
    //         };
    //         reader.readAsArrayBuffer(fileInput);
    //         document.getElementById('fileInput').value='';
    //         box.style.display = 'none';

    //     };
    //     newDiv.appendChild(newButton);
    
    //     // Append the new div to the container div
    //     box.appendChild(newDiv);
    });

    // Trigger the file input to open the file dialog
    //fileInput.click();
});

document.getElementById('sendFileButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput').files[0];
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

        socket.send(JSON.stringify(message));
    };
    reader.readAsArrayBuffer(fileInput);
    document.getElementById('fileInput').value=''; //clear the input
    document.getElementById('pop_up').style.display='none';
});
function leaveRoom() {
    
    window.location.href="..";
}


// async function handleFile(fileName, fileData, sent_username) {
//     const byteCharacters = atob(fileData); //base-64 string to binary string conversion
//     const byteArrays = [];

//     for (let offset = 0; offset < byteCharacters.length; offset += 512) {
//         const slice = byteCharacters.slice(offset, offset + 512);
//         const byteNumbers = new Array(slice.length);
//         for (let i = 0; i < slice.length; i++) {
//             byteNumbers[i] = slice.charCodeAt(i);
//         }
//         byteArrays.push(new Uint8Array(byteNumbers));
//     }

//     const timestamp = new Date().getTime();
//     const uniqueFileName = `${timestamp}_${fileName}`;

//     const blob = new Blob(byteArrays, { type: 'application/octet-stream' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = uniqueFileName;
//     // a.click();
//     a.textContent = `Download ${fileName}`;
    
//     // Optional: Create a div or any other element to show the download link
//     const fileContainer = document.createElement('div');
//     fileContainer.appendChild(a);

//     // Append the link to the messages div or another container element
//     const messagesDiv = document.getElementById('messages');
//     if(sent_username===username){
//         fileContainer.classList.add('my-message');
//     }
//     else {
//         fileContainer.classList.add('other-messsage');
//     }
//     fileContainer.classList.add('message');
//     messagesDiv.appendChild(fileContainer);
    
//     if(a.click()){
//         // /file_path/{file_name}
//         const file_url=`https://chatroom-fksh.onrender.com/file_path/${uniqueFileName}`;
//         // Check if the username is unique
//         try{
//             let response = await fetch(file_url, {
//             method: 'POST',
//             headers: {
//                 "Content-type": "application/json; charset=UTF-8"
//             }
//             });

//             let data = await response.json();
//             console.log(data);

//             if (data.status === 'success') {
//                 a.href=data.file_path;
//                 a.textContent = `Open ${fileName}`;
//             }
//         }
//         catch (error){
//             console.log('error:',e);
//         }
//         URL.revokeObjectURL(url); // Clean up the URL object after download

//     }
    
//     // Optional: Log a message for debugging
//     console.log(`Received file: ${fileName}`);
// }


// async function handleFile(fileName, fileData, sent_username) {
//     const byteCharacters = atob(fileData); // base-64 string to binary string conversion
//     const byteArrays = [];

//     for (let offset = 0; offset < byteCharacters.length; offset += 512) {
//         const slice = byteCharacters.slice(offset, offset + 512);
//         const byteNumbers = new Array(slice.length);
//         for (let i = 0; i < slice.length; i++) {
//             byteNumbers[i] = slice.charCodeAt(i);
//         }
//         byteArrays.push(new Uint8Array(byteNumbers));
//     }

//     const timestamp = new Date().getTime();
//     const uniqueFileName = `${timestamp}_${fileName}`;

//     const blob = new Blob(byteArrays, { type: 'application/octet-stream' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = uniqueFileName;
//     a.textContent = `Download ${fileName}`;

//     // Optional: Create a div to show the download link
//     const fileContainer = document.createElement('div');
//     fileContainer.appendChild(a);

//     // Append the link to the messages div or another container element
//     const messagesDiv = document.getElementById('messages');
//     if (sent_username === username) {
//         fileContainer.classList.add('my-message');
//     } else {
//         fileContainer.classList.add('other-message');
//     }
//     fileContainer.classList.add('message');
//     messagesDiv.appendChild(fileContainer);

//     // Add event listener for when the link is clicked
//     a.addEventListener('click', async (event) => {
//         event.preventDefault(); // Prevent default action to control the flow

//         // Optional: Log or perform any action before downloading
//         console.log(`User clicked to download: ${fileName}`);

//         // Proceed with download after logging
//         // a.click();

//         // Optionally, fetch the file path from the server after the click
//         const file_url = `https://chatroom-fksh.onrender.com/file_path/${uniqueFileName}`;
//         try {
//             let response = await fetch(file_url, {
//                 method: 'POST',
//                 headers: {
//                     "Content-type": "application/json; charset=UTF-8"
//                 }
//             });

//             let data = await response.json();
//             console.log(data);

//             if (data.status === 'success') {
//                 // Update the href to the server path if successful
//                 a.href = data.file_path;
//                 a.textContent = `Open ${fileName}`;
//             }
//         } catch (error) {
//             console.error('Error fetching file path:', error);
//         }

//         URL.revokeObjectURL(url); // Clean up the URL object after download
//     });

//     // Log the file name for debugging
//     console.log(`Received file: ${fileName}`);
// }

function handleFile(fileName, fileData, sent_username) {
    const byteCharacters = atob(fileData); //base-64 string to binary string conversion
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
    // a.click();
    a.textContent = `Download ${fileName}`;
    
    // Optional: Create a div or any other element to show the download link
    const fileContainer = document.createElement('div');
    fileContainer.appendChild(a);

    // Append the link to the messages div or another container element
    const messagesDiv = document.getElementById('messages');
    if(sent_username===username){
        fileContainer.classList.add('my-message');
    }
    else {
        fileContainer.classList.add('other-messsage');
    }
    fileContainer.classList.add('message');
    messagesDiv.appendChild(fileContainer);
    
    // Optional: Log a message for debugging
    console.log(`Received file: ${fileName}`);
}

document.getElementById('videocall').addEventListener('click',function(){
    const msg1={
        type:"call",
        from_username:username
        // from:username
    };
    socket.send(JSON.stringify(msg1));
})

document.getElementById('voicecall').addEventListener('click',function(){
    const msg1={
        type:"call",
        from_username:username
        // from:username
    };
    socket.send(JSON.stringify(msg1));
})

async function accept_vc() {
    console.log('accept func called');
    window.location.href = '/frontend/call.html';
}