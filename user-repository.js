import 
import bcrypt from 'bcrypt'
import { createUserWithEmailAndPassword, signInWithCredential } from 'firebase/auth';
import { auth, SALT_ROUNDS } from './config.js'

export class UserRepository {
  static async register ( username, password) {
    Validation.username(username)
    Validation.password(password)

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    try {
      await createUserWithEmailAndPassword(auth, username, password)
      return true
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        return false
      } else {
        throw error
      }
    }
  }

  static async userExist (email, password) {
    try {
      await signInWithCredential(auth, email, password)
      return true
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
  static username (username) {
    if (typeof username !== 'string') throw new Error('Username must be a string')
    if (username.length < 6) throw new Error('Username must be at least 6 characters long')
    if (username.length > 20) throw new Error('Username must be at most 20 characters long')
    if (!/^[a-zA-Z0-9_]+$/.test(username)) throw new Error('Username must only contain letters, numbers, and underscores')
    if (/^_/.test(username)) throw new Error('Username must not start with an underscore')
    if (/_$/.test(username)) throw new Error('Username must not end with an underscore')
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
