const signUpButton = document.getElementById('signUpButton')
const signInButton = document.getElementById('signInButton')
const signInForm = document.getElementById('signIn')
const signUpForm = document.getElementById('signup')

signUpButton.addEventListener('click', function () {
  signInForm.style.display = 'none'
  signUpForm.style.display = 'block'
})

signInButton.addEventListener('click', function () {
  signInForm.style.display = 'block'
  signUpForm.style.display = 'none'
})

const $ = (el) => document.querySelector(el)
const loginForm = $('#loginForm')
const loginSpan = $('#loginForm span') || { innerText: '', style: {} }

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = $('#email').value
  const password = $('#password').value

  fetch('http://localhost:3000/login', { // Ensure the correct URL
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then((res) => {
      console.log('Status:', res.status)
      if (res.ok) {
        return res.json()
      } else {
        throw new Error('Invalid credentials')
      }
    })
    .then((data) => {
      console.log('Login successful:', data)
      loginSpan.innerText = 'Login successful, redirecting...'
      loginSpan.style.color = 'green'
      setTimeout(() => {
        window.location.href = '/protected'
      }, 2000)
    })
    .catch((error) => {
      console.error('Login error:', error)
      loginSpan.innerText = error.message
      loginSpan.style.color = 'red'
    })
})
