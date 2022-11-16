import express from 'express'
import bodyParser from 'body-parser'
import { videosRouter } from './routers/videos-router'
import { testingRouter } from './routers/testing-router'

export const app = express()
const port = process.env.PORT || 5000

const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)
app.use('/api/videos', videosRouter)
app.use('/api/testing', testingRouter)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
