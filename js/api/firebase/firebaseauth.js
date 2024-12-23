// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js'
// eslint-disable-next-line no-unused-vars
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js'
import { getFirestore, setDoc, doc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDQuKgNvmamuOnQwynu_ciNQhf3NF947XQ',
  authDomain: 'virtubuddy-8224a.firebaseapp.com',
  projectId: 'virtubuddy-8224a',
  storageBucket: 'virtubuddy-8224a.appspot.com',
  messagingSenderId: '93026280488',
  appId: '1:93026280488:web:b413b8077de90d8568011d'
}
// Initialize Firebase
// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig)

// Email and Password Authentication--------------

function showMessage (message, divId) {
  const messageDiv = document.getElementById(divId)
  messageDiv.style.display = 'block'
  messageDiv.innerHTML = message
  messageDiv.style.opacity = 1
  setTimeout(function () {
    messageDiv.style.opacity = 0
  }, 5000)
}

// Fuction to signUp
const signUp = document.getElementById('submitSignUp')
signUp.addEventListener('click', (event) => {
  event.preventDefault()
  const email = document.getElementById('rEmail').value
  const password = document.getElementById('rPassword').value
  const firstName = document.getElementById('fName').value
  const lastName = document.getElementById('lName').value
  const auth = getAuth()
  const db = getFirestore()

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user
      const userData = {
        email,
        firstName,
        lastName
      }
      showMessage('Account Created Successfully', 'signUpMessage')
      const docRef = doc(db, 'users', user.uid)
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = 'index.html'
        })
        .catch((error) => {
          console.error('error writing document', error)
        })
    })
    .catch((error) => {
      const errorCode = error.code
      // eslint-disable-next-line eqeqeq
      if (errorCode == 'auth/email-already-in-use') {
        showMessage('Email Address Already Exists !!!', 'signUpMessage')
      } else {
        showMessage('unable to create User', 'signUpMessage')
      }
    })
})

// Function to singIn
const signIn = document.getElementById('submitSignIn')
signIn.addEventListener('click', (event) => {
  event.preventDefault()
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const auth = getAuth()

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage('login is successful', 'signInMessage')
      const user = userCredential.user
      // eslint-disable-next-line no-undef
      localStorage.setItem('loggedInUserId', user.uid)
      window.location.href = 'homepage.html'
    })
    .catch((error) => {
      const errorCode = error.code
      if (errorCode === 'auth/invalid-credential') {
        showMessage('Incorrect Email or Password', 'signInMessage')
      } else {
        showMessage('Account does not Exist', 'signInMessage')
      }
    })
})

// Google Authentication----------------

const provider = new GoogleAuthProvider()
// eslint-disable-next-line no-undef
auth.languageCode = 'es'

const googleButton = document.getElementById('googleButton')
googleButton.addEventListener('click', (event) => {
  event.preventDefault()
  const auth = getAuth()
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result)
      // eslint-disable-next-line no-unused-vars
      const token = credential.accessToken
      const user = result.user
      // eslint-disable-next-line no-undef
      localStorage.setItem('loggedInUserId', user.uid)
      window.location.href = 'homepage.html'
    })
    .catch((error) => {
      // eslint-disable-next-line no-unused-vars
      const errorMessage = error.message
      // eslint-disable-next-line no-unused-vars
      const email = error.email
      // eslint-disable-next-line no-unused-vars
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log(error)
    })
})
