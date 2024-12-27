import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './config.js'

export class UserRepository {
  static async register (email, password) {
    Validation.email(email)
    Validation.password(password)

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      return true
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        return false
      } else {
        throw error
      }
    }
  }

  static async login (email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      if (user !== null) {
        const { password: _, ...publicUser } = user
        return publicUser
      } else {
        return false
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        return false
      } else {
        throw error
      }
    }
  }
}

class Validation {
  static email (email) {
    if (typeof email !== 'string') throw new Error('Email must be a string')
    if (email.length < 6) throw new Error('Email must be at least 6 characters long')
    if (email.length > 50) throw new Error('Email must be at most 50 characters long')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email must be a valid email address')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('Password must be a string')
    if (password.length < 8) throw new Error('Password must be at least 8 characters long')
    if (password.length > 50) throw new Error('Password must be at most 50 characters long')
    if (!/[a-z]/.test(password)) throw new Error('Password must contain at least one lowercase letter')
    if (!/[A-Z]/.test(password)) throw new Error('Password must contain at least one uppercase letter')
    if (!/[0-9]/.test(password)) throw new Error('Password must contain at least one number')
    if (!/[^a-zA-Z0-9]/.test(password)) throw new Error('Password must contain at least one special character')
    if (/^_/.test(password)) throw new Error('Password must not start with an underscore')
    if (/_$/.test(password)) throw new Error('Password must not end with an underscore')
    if (/^\d+$/.test(password)) throw new Error('Password must not be entirely numeric')
    if (/^[a-zA-Z]+$/.test(password)) throw new Error('Password must not be entirely alphabetic')
  }
}
