import express from 'express'
import moment from 'moment'
import { isEmpty, trim } from 'lodash'
import { getNextId, getErrors } from './utils'
import { HTTPStatuses } from './types'
import { db } from './mocks'

export const app = express()
const port = 3000

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app
  .get('/', (_, res) => {
    res.status(HTTPStatuses.SUCCESS200).send(db.videos)
  })
  .get('/api/videos', (_, res) => {
    res.status(HTTPStatuses.SUCCESS200).send(db.videos)
  })
  .post('/api/videos', (req, res) => {
    const errors = getErrors(req.body)

    if (!isEmpty(errors)) {
      res.status(HTTPStatuses.BADREQUEST400).send(errors)
      return
    }    
    
    const item = {
      id: getNextId(),
      title: trim(String(req.body.title)),
      author: trim(String(req.body.author)),
      availableResolutions: !isEmpty(req.body.availableResolutions) ? req.body.availableResolutions : null,
      canBeDownloaded: req.body.canBeDownloaded || false,
      minAgeRestriction: req.body.minAgeRestriction || null,
      createdAt: moment().format(),
      publicationDate: moment().format(),
    }

    db.videos.push(item)
    res.status(HTTPStatuses.CREATED201).send(item)
  })
  .get('/api/videos/:id', (req, res) => {
    const video = db.videos.find(({ id }) => id === Number(req.params.id))

    if (!video) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }

    res.status(HTTPStatuses.SUCCESS200).send(video)
  })
  .put('/api/videos/:id', (req, res) => {
    const errors = getErrors(req.body)

    if (!isEmpty(errors)) {
      res.status(HTTPStatuses.BADREQUEST400).send(errors)
      return
    }

    const id = +req.params.id    
    const video = db.videos.find((video) => video.id === id)

    if (!video) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }   

    video.id = id,
    video.title = trim(String(req.body.title)),
    video.author = trim(String(req.body.author)),
    video.availableResolutions = !isEmpty(req.body.availableResolutions) ? req.body.availableResolutions : null,
    video.canBeDownloaded = req.body.canBeDownloaded || false,
    video.minAgeRestriction = req.body.minAgeRestriction || null,
    video.createdAt = video.createdAt,
    video.publicationDate = req.body.publicationDate,

    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .delete('/api/videos/:id', (req, res) => {
    const video = db.videos.find(({ id }) => id === +req.params.id)

    if (!video) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }
    
    db.videos = db.videos.filter(({ id }) => id !== video.id)
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .delete('/api/testing/all-data', (_, res) => {
    db.videos = []
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
