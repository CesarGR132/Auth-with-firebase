import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, getFS, SD, DC } from './config.js'

export class UserRepository {
  static async register (firstName, lastName, email, password) {
    Validation.firstName(firstName)
    Validation.lastName(lastName)
    Validation.email(email)
    Validation.password(password)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const UserData = {
        email,
        firstName,
        lastName
      }
      const docRef = DC(getFS, 'users', user.uid)
      await SD(docRef, UserData)
      const { password: _, ...publicUser } = user
      return publicUser
    } catch (error) {
      console.error('Error during registration:', error)
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

  static firstName (firstName) {
    if (typeof firstName !== 'string') throw new Error('First name must be a string')
    if (firstName.length < 2) throw new Error('First name must be at least 2 characters long')
    if (firstName.length > 50) throw new Error('First name must be at most 50 characters long')
    if (!/^[a-zA-Z]+$/.test(firstName)) throw new Error('First name must contain only alphabetic characters')
  }

  static lastName (lastName) {
    if (typeof lastName !== 'string') throw new Error('Last name must be a string')
    if (lastName.length < 2) throw new Error('Last name must be at least 2 characters long')
    if (lastName.length > 50) throw new Error('Last name must be at most 50 characters long')
    if (!/^[a-zA-Z]+$/.test(lastName)) throw new Error('Last name must contain only alphabetic characters')
  }
}
