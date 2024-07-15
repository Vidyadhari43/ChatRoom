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
    sessionStorage.setItem('username',name);
    window.location.href="home.html";
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
    sessionStorage.setItem('username',name);
    window.location.href="home.html";
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



document.getElementById('login').addEventListener('click',(e)=>{

const username=document.getElementById('log-name').value;
sessionStorage.setItem('username',username);

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
alert('Welcome '+username);

window.location.href="home.html"

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




document.getElementById('register').addEventListener('click',(e)=>{

  const username=document.getElementById('sig-name').value;
  sessionStorage.setItem('username',username);
var email=document.getElementById('sig-mail').value;

var password=document.getElementById('sig-password').value;
     
createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
// Signed up 
const user = userCredential.user;

set(ref(database,'users/'+user.uid),{
    username:username,
    email:email
})
//document.getElementById('logout').style.display='block';
alert("Successfully registered!");
window.location.href="home.html"
// ...
})
.catch((error) => {
const errorCode = error.code;
const errorMessage = error.message;
// ..
alert(errorMessage);


});


})



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