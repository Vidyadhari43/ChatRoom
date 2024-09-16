import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase,set,ref,update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut,sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { GoogleAuthProvider,signInWithRedirect,getRedirectResult } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js" ;
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
const provider = new GoogleAuthProvider(app);

//var login=document.getElementById("login");

auth.onAuthStateChanged(user => {
  if (user) {
  // User is signed in, see docs for a list of available properties
  // https://firebase.google.com/docs/reference/js/auth.user
  console.log('user logged in');
  document.getElementById('logout').style.display='block';
  document.getElementById('sign-up').style.display='none';
  

  // ...
  } else {
  // User is signed out
  // ...
  console.log('user logged out');
  document.getElementById('logout').style.display='none';
  document.getElementById('sign-up').style.display='block';
  
  }
  });
  
  var googleBtn=document.getElementById('google-btn');
googleBtn.addEventListener('click',(e)=>{
  signInWithRedirect(auth, provider);
 alert("clicked");
  getRedirectResult(auth)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    sessionStorage.setItem('username',user.displayName);

   
    
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  })
})






document.getElementById('login').addEventListener('click',(e)=>{

const username=document.getElementById('name').value;
sessionStorage.setItem('username',username);

var email=document.getElementById('email').value;

var password=document.getElementById('password').value;
     
signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
// Signed in 
const user = userCredential.user;

const dt=new Date();
update(ref(database,'users/'+user.uid),{
last_login:dt,
})
alert('Welcome '+username);
window.location.href="https://chatroom-fksh.onrender.com"

// ...
})
.catch((error) => {
const errorCode = error.code;
const errorMessage = error.message;
alert(errorMessage);
});

})












let ForgotPassword = ()=>{
sendPasswordResetEmail(auth,document.getElementById('email').value)
.then(()=>{
alert("A password reset link has been sent to your email");
})
.catch((error)=>{
console.log(error.code);
console.log(error.message);
})

}

document.getElementById('forgotpass').addEventListener("click",ForgotPassword);




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration