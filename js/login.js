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
const loginSpan = $('#loginForm span')

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = $('#email').value
  const password = $('#password').value

  fetch('login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then((res) => {
      if (res.ok) {
        loginSpan.innerText = 'Login successful redirecting...'
        loginSpan.style.color = 'red'
        setTimeout(() => {
          window.location.href = '/protected'
        }, 2000)
      } else {
        loginSpan.innerText = 'Invalid credentials'
        loginSpan.style.color = 'red'
      }
    })
})
