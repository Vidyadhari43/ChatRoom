// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase,set,ref } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword,signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

register.addEventListener('click',(e)=>{


var email=document.getElementById('email').value;
var username=document.getElementById('name').value;
var password=document.getElementById('password').value;
     
    createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
// Signed up 
const user = userCredential.user;

set(ref(database,'users/'+user.uid),{
    username:username,
    email:email
})
document.getElementById('logout').style.display='block';

alert('Welcome'+user.displayName);
window.location.href="login.html"
// ...
})
.catch((error) => {
const errorCode = error.code;
const errorMessage = error.message;
// ..
alert(errorMessage);


});


})
