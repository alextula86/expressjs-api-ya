import { Router } from "express";
import { isEmpty, trim } from 'lodash'
import { getNextId, getErrors } from '../utils'
import { HTTPStatuses } from '../types'
import { db } from '../mocks'

export const videosRouter = Router()

videosRouter
  .get('/', (_, res) => {
    res.status(HTTPStatuses.SUCCESS200).send(db.videos)
  })
  .get('/', (_, res) => {
    res.status(HTTPStatuses.SUCCESS200).send(db.videos)
  })
  .post('/', (req, res) => {
    const errors = getErrors(req.body)

    if (!isEmpty(errors.errorsMessages)) {
      res.status(HTTPStatuses.BADREQUEST400).send(errors)
      return
    }

    const dateISO = new Date().toISOString()
    
    const item = {
      id: getNextId(),
      title: trim(String(req.body.title)),
      author: trim(String(req.body.author)),
      availableResolutions: !isEmpty(req.body.availableResolutions) ? req.body.availableResolutions : null,
      canBeDownloaded: req.body.canBeDownloaded || false,
      minAgeRestriction: req.body.minAgeRestriction || null,
      createdAt: dateISO,
      publicationDate: dateISO,
    }

    db.videos.push(item)
    res.status(HTTPStatuses.CREATED201).send(item)
  })
  .get('/:id', (req, res) => {
    const video = db.videos.find(({ id }) => id === Number(req.params.id))

    if (!video) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }

    res.status(HTTPStatuses.SUCCESS200).send(video)
  })
  .put('/:id', (req, res) => {
    const errors = getErrors(req.body)

    if (!isEmpty(errors.errorsMessages)) {
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
  .delete('/:id', (req, res) => {
    const video = db.videos.find(({ id }) => id === +req.params.id)

    if (!video) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }
    
    db.videos = db.videos.filter(({ id }) => id !== video.id)
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
