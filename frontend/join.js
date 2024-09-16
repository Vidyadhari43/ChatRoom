async function myFunc(){
    try{
        var ip_roomcode=document.getElementById('roomcode').value;
        var url=`https://chatroom-fksh.onrender.com/join_room/enter_code/${ip_roomcode}`;
        let response=await fetch(url,{
            method:'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
            // ,
            // body: JSON.stringify({ unique_code: ip_roomcode })
        });
        const username=document.getElementById('username').value;
    sessionStorage.setItem('username',username);
    if(!username) alert("Enter username");
     
        let data = await response.json();
        await console.log(data);
        if(data.status==='fail'){
            alert('Invalid Roomcode')
            window.location.href="join.html";
        }
        else if(data.status==='success'){
            sessionStorage.setItem('roomcode',ip_roomcode);
            window.location.href="chat.html";
        }
    }
    catch(error){
        console.log(error);
        alert('An error occured while joining. Please try again');
    }
}