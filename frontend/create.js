async function myFunc() {
    try {
        document.getElementById('generate').style.display = 'none';
        document.getElementById('enter').style.display = 'block';
        let roomcode = document.getElementById('roomcode');
        let cpy=document.getElementById('cpy-btn');
        // URL for the API request
        let url = "https://chatroom-fksh.onrender.com/create_room/unique_code_generate";

        // Make the API request and wait for the response
        let response = await fetch(url);

        // Parse the JSON response
        let data = await response.json();

        // consoling for debugging
        await console.log(data);
        // console.log(typeof data);
        // console.log(data.unique_code);

        roomcode.style.display = 'block';
        cpy.style.display='block';
        roomcode.value = data.unique_code;
        sessionStorage.setItem('roomcode',data.unique_code)

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while generating the code. Please try again.');
    }
}

function chat(){
    const username=document.getElementById('username').value;
    sessionStorage.setItem('username',username);
    if(!username) alert("Enter username");
     else window.location.href="chat.html";
    
    // var code=document.getElementById('')
}

function copyOutput() {
    var copyText = document.getElementById("roomcode");
  
    copyText.select();
  
    navigator.clipboard.writeText(copyText.value);
  }
//   document.addEventListener('DOMContentLoaded', (event) => {
//     const username = sessionStorage.getItem('username');
//     if (username) {
//         document.getElementById('user-greeting').textContent = `Welcome, ${username}!`;
//     } else {
//         document.getElementById('user-greeting').textContent = 'No username found!';
//     }
// });

