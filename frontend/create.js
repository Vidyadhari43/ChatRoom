async function myFunc() {
    try {
        document.getElementById('generate').style.display = 'none';
        document.getElementById('enter').style.display = 'block';
        let roomcode = document.getElementById('roomcode');

        // URL for the API request
        let url = "http://127.0.0.1:8000/create_room/unique_code_generate";

        // Make the API request and wait for the response
        let response = await fetch(url);

        // Parse the JSON response
        let data = await response.json();

        // consoling for debugging
        await console.log(data);
        // console.log(typeof data);
        // console.log(data.unique_code);

        roomcode.style.display = 'block';
        roomcode.value = data.unique_code;
        sessionStorage.setItem('roomcode',data.unique_code)

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while generating the code. Please try again.');
    }
}

function chat(){
    window.location.href="chat.html"
    // var code=document.getElementById('')
}
