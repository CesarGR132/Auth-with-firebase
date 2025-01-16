import express from 'express'
import cors from 'cors'
import { PORT, FIREBASE_API_KEY } from './config.js'
import { UserRepository } from './user-repository.js'
import cookieParser from 'cookie-parser'
import { auth } from './admin.js'

const app = express()

app.set('view engine', 'html')

app.use(cors())

app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }

  try {
    if (token) {
      const decodedToken = auth.verifyIdToke(token)
      req.session.user = decodedToken
    }
  } catch (error) {}

  next()
})

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('http://192.168.1.76:8080/')
  } else {
    res.redirect('/views/login.html')
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const tokens = await UserRepository.login(email, password)
    if (tokens) {
      res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60
      })
      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 30
      })
      res.status(200).json({ accessToken: tokens.accessToken })
    } else {
      res.status(401).send('Invalid credentials')
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
})

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  try {
    const success = await UserRepository.register(firstName, lastName, email, password)
    if (success) {
      res.status(201).json({ message: 'User registered successfully' })
    } else {
      res.status(400).json({ message: 'User already exists' })
    }
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: error.message })
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('access_token')
    .clearCookie('refresh_token')
    .redirect('/views/login.html')
})

app.get('/protected', (req, res) => {
  res.redirect('http://192.168.1.76:8080/')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// Methods to verify and refresh tokens
app.post('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refresh_token
  if (!refreshToken) {
    return res.status(401).send('Unauthorized')
  }

  try {
    const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    })
    const data = await response.json()
    const newAccessToken = data.access_token

    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 1000 * 60 * 60
    })
    res.status(200).json({ accessToken: newAccessToken })
  } catch (error) {
    res.status(401).send('Unauthorized')
  }
})

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token || req.headers.authorization.split(' ')[1]

  if (!token) {
    return res.status(401).send('Unauthorized')
  }

  try {
    const decodedToken = await auth.verifyIdToken(token)
    req.session.user = decodedToken
    next()
  } catch (error) {
    res.status(401).send('Unauthorized')
  }
}
