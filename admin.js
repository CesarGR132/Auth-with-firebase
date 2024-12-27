import admin from 'firebase-admin'
import fs from 'fs'
import path from 'path'

const serviceAccountPath = path.resolve('./private/virtubuddy-8224a-firebase-adminsdk-3r755-d33ead3a7d.json')
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

export const auth = admin.auth()
