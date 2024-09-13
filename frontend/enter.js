const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});




//login.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase,set,ref,update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut,sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { GoogleAuthProvider,signInWithRedirect,getRedirectResult,signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js" ;


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzd--V_Qe5ZxaeltjzhnKECyj6Tv0k-yw",
  authDomain: "chat-b927e.firebaseapp.com",
  databaseURL: "https://chat-b927e-default-rtdb.firebaseio.com",
  projectId: "chat-b927e",
  storageBucket: "chat-b927e.appspot.com",
  messagingSenderId: "832874554081",
  appId: "1:832874554081:web:520ed5628cb8b34a6ecda0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database=getDatabase(app);
const auth = getAuth();
const provider = new GoogleAuthProvider(app);

//var login=document.getElementById("login");

auth.onAuthStateChanged(user => {
  if (user) {
  // User is signed in, see docs for a list of available properties
  // https://firebase.google.com/docs/reference/js/auth.user
  console.log('user logged in');
 // document.getElementById('logout').style.display='block';
 // document.getElementById('sign-up').style.display='none';
  

  // ...
  } else {
  // User is signed out
  // ...
  console.log('user logged out');
  //document.getElementById('logout').style.display='none';
  //document.getElementById('sign-up').style.display='block';
  
  }
  });
  

  //popup google
 
  var googleBtn=document.getElementById('google-btn');
  googleBtn.addEventListener('click',(e)=>{ 
    console.log('hi login');
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    alert(user.displayName);
    const name=user.displayName;
    // sessionStorage.setItem('username',name);
    window.location.href="..";
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    alert(errorMessage);
    // ...
  });
})


var googleBtnsig=document.getElementById('google-btn-sig');
  googleBtnsig.addEventListener('click',(e)=>{ 

    console.log('hii');
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    document.getElementById('sig-mail').style.display='none';
    document.getElementById('sig-password').style.display='none';
    //document.getElementById('option').innerHTML="Enter username";
    document.getElementById('register').style.display='none';
    // var newbutton=document.createElement('button');
    // newbutton.innerText="Continue";
    // var container=document.getElementById('credentials');
    // container.appendChild(newbutton);
    document.getElementById('newbutton').style.display='block';

    // IdP data available using getAdditionalUserInfo(result)
    alert(user.displayName);
    const name=user.displayName;
    // sessionStorage.setItem('username',name);
   // window.location.href="home.html";
    // ...
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const credential = GoogleAuthProvider.credentialFromError(error);
    alert(errorMessage);
  });
})

document.getElementById('newbutton').addEventListener('click',async (e)=>{
  const username = await document.getElementById('sig-name').value;
  // const checkUsernameUrl = `http://my-fastapi-app.onrender.com:8000/signup/unique_username/${username}`;
  // const insertUsernameUrl = `http://my-fastapi-app.onrender.com:8000/signup/insert_unique_username/${username}`;
  try {
    // Check if the username is unique
    // let response = await fetch(checkUsernameUrl, {
    //   method: 'POST',
    //   headers: {
    //     "Content-type": "application/json; charset=UTF-8"
    //   }
    // });

    // let data = await response.json();
    // console.log(data);

    // if (data.status === 'fail') {
    //   alert(data.msg);
    // } 
    // else {
      // sessionStorage.setItem('username', username);

      // let response = await fetch(insertUsernameUrl, {
      //   method: 'POST',
      //   headers: {
      //     "Content-type": "application/json; charset=UTF-8"
      //   }
      // });

      // let data = await response.json();
      // console.log(data.msg);

      // if (data.status === 'fail') {
      //   throw new Error(data.msg);
      // } 
      // else {
        alert("Successfully registered!");
        window.location.href = "..";
      // }
    // }
  } 
  catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
})


document.getElementById('login').addEventListener('click',(e)=>{

// const username=document.getElementById('log-name').value;
// sessionStorage.setItem('username',username);

var email=document.getElementById('log-mail').value;

var password=document.getElementById('log-password').value;
     
signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
// Signed in 
const user = userCredential.user;

const dt=new Date();
update(ref(database,'users/'+user.uid),{
last_login:dt,
})
// alert('Welcome '+username);

window.location.href=".."

// ...
})
.catch((error) => {
const errorCode = error.code;
const errorMessage = error.message;
alert(errorMessage);
});
})

let ForgotPassword = ()=>{
sendPasswordResetEmail(auth,document.getElementById('log-mail').value)

.then(()=>{
alert("A password reset link has been sent to your email");
})
.catch((error)=>{
console.log(error.code);
console.log(error.message);
})
}

document.getElementById('forgotpass').addEventListener("click",ForgotPassword);

//signup.js
document.getElementById('register').addEventListener('click', async (e) => {
  e.preventDefault();

  // const username = document.getElementById('sig-name').value;
  const email = document.getElementById('sig-mail').value;
  const password = document.getElementById('sig-password').value;

  // const checkUsernameUrl = `http://0.0.0.0:8000/signup/unique_username/${username}`;
  // const insertUsernameUrl = `http://0.0.0.0:8000/signup/insert_unique_username/${username}`;

  try {
    // Check if the username is unique
    // let response = await fetch(checkUsernameUrl, {
    //   method: 'POST',
    //   headers: {
    //     "Content-type": "application/json; charset=UTF-8"
    //   }
    // });

    // let data = await response.json();
    // console.log(data);

    // if (data.status === 'fail') {
    //   alert(data.msg);
    // } 
    // else {
      // Username is unique, proceed with Firebase Authentication
      // sessionStorage.setItem('username', username);

      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;

          // Insert the unique username in the backend
          // let response = await fetch(insertUsernameUrl, {
          //   method: 'POST',
          //   headers: {
          //     "Content-type": "application/json; charset=UTF-8"
          //   }
          // });

          // let data = await response.json();
          // console.log(data.msg);

          // if (data.status === 'fail') {
          //   throw new Error(data.msg);
          // } 
          // else {
            // Store additional user data in Firebase Realtime Database
            
            await set(ref(database, 'users/' + user.uid), {
              // username: username,
              email: email
            });

            alert("Successfully registered!");
            window.location.href = "..";
          // }
        })
        .catch((error) => {
          console.error('Error during user creation:', error);
          alert(error.message);
        });
    // }
  } 
  catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
});


//logout.js

document.getElementById("logout").addEventListener("click",function(){
  signOut(auth).then(() => {
            // Sign-out successful.
    console.log('Sign-out successful.');
    alert('Sign-out successful.');
    document.getElementById('logout').style.display = 'none';
    document.getElementById('name').value="";
    document.getElementById('email').value="";
    document.getElementById('password').value="";
  }).catch((error) => {
    // An error happened.
    console.log('An error happened.');
  });
})