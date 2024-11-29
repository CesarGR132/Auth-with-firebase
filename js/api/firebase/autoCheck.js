import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDQuKgNvmamuOnQwynu_ciNQhf3NF947XQ",
    authDomain: "virtubuddy-8224a.firebaseapp.com",
    projectId: "virtubuddy-8224a",
    storageBucket: "virtubuddy-8224a.appspot.com",
    messagingSenderId: "93026280488",
    appId: "1:93026280488:web:b413b8077de90d8568011d"
  };
  // Initialize Firebase
 const app = initializeApp(firebaseConfig);

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
    }else{
        alert('There was an error');
    }
});