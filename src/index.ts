import express from "express";
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { runDb } from './repositories/db'
import { blogsRouter } from './routers/blogs-router'
import { postsRouter } from './routers/posts-router'
import { commentsRouter } from './routers/comments-router'
import { usersRouter } from './routers/users-router'
import { authRouter } from './routers/auth-router'
import { testingRouter } from './routers/testing-router'

export const app = express()
const port = process.env.PORT || 5000

const jsonBodyMiddleware = bodyParser.json()
const jsonCookieMiddleware = cookieParser()

app.use(jsonBodyMiddleware)
app.use(jsonCookieMiddleware)

app.use('/api/blogs', blogsRouter)
app.use('/api/posts', postsRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
app.use('/api/testing', testingRouter)

const startApp = async () => {
  await runDb()
  app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
}

startApp()
