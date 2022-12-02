import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'
import { BlogType, PostType } from '../types'
dotenv.config()

const mongoUri = process.env.MONGO_ATLAS_URI || process.env.MONGO_URI

if (!mongoUri) {
  throw new Error('Url doesnt found')
}

const client = new MongoClient(mongoUri)
const db = client.db()

export const blogCollection = db.collection<BlogType>('blogs')
export const postCollection = db.collection<PostType>('posts')

export async function runDb() {
  try {
    await client.connect()
    await client.db('blogs').command({ ping: 1 })
    console.log('Connected successfully to server')
  } catch {
    console.log('Can`t connect to db')
    await client.close()
  }
}
