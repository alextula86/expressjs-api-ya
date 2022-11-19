import { Router, Response } from "express";
import { isEmpty, trim } from 'lodash'
import { getNextId, getErrors } from '../utils'
import {
  HTTPStatuses,
  VideoType,
  VideoViewModel,
  URIParamsVideoModel,
  CreateVideoModel,
  UpdateVideoModel,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  ErrorsMessageType,
} from '../types'
import { db } from '../mocks'

export const videosRouter = Router()

const getViewModel = (dbVideo: VideoType): VideoViewModel => ({
  id: dbVideo.id,
  title: dbVideo.title,
  author: dbVideo.author,
  availableResolutions: dbVideo.availableResolutions,
  canBeDownloaded: dbVideo.canBeDownloaded,
  minAgeRestriction: dbVideo.minAgeRestriction,
  createdAt: dbVideo.createdAt,
  publicationDate: dbVideo.publicationDate,
})

videosRouter
  .get('/', (_, res: Response<VideoViewModel[]>) => {
    const result: VideoViewModel[] = db.videos.map(getViewModel)
    res.status(HTTPStatuses.SUCCESS200).send(result)
  })
  .get('/:id', (req: RequestWithParams<URIParamsVideoModel>, res: Response<VideoViewModel>) => {
    const video = db.videos.find((item) => item.id === +req.params.id)

    if (!video) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }

    const result = getViewModel(video)

    res.status(HTTPStatuses.SUCCESS200).send(result)
  })
  .post('/', (req: RequestWithBody<CreateVideoModel>, res: Response<VideoViewModel | ErrorsMessageType>) => {
    const errors = getErrors(req.body)

    if (!isEmpty(errors.errorsMessages)) {
      res.status(HTTPStatuses.BADREQUEST400).send(errors)
      return
    }

    const createdAtISO = new Date().toISOString()
    const publicationDate = new Date()
    publicationDate.setDate(publicationDate.getDate() + 1)
    const publicationDateISO = publicationDate.toISOString()
    
    const createdVideo: VideoType = {
      id: getNextId(),
      title: trim(String(req.body.title)),
      author: trim(String(req.body.author)),
      availableResolutions: !isEmpty(req.body.availableResolutions) ? req.body.availableResolutions : null,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: createdAtISO,
      publicationDate: publicationDateISO,
    }

    db.videos.push(createdVideo)
    const result = getViewModel(createdVideo)
    res.status(HTTPStatuses.CREATED201).send(result)
  })

  .put('/:id', (req: RequestWithParamsAndBody<URIParamsVideoModel, UpdateVideoModel>, res: Response) => {
    const errors = getErrors(req.body)

    if (!isEmpty(errors.errorsMessages)) {
      res.status(HTTPStatuses.BADREQUEST400).send(errors)
      return
    }

    const id = +req.params.id
    const video = db.videos.find((item) => item.id === id)

    if (!video) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }   

    const publicationDate = new Date()
    publicationDate.setDate(publicationDate.getDate() + 1)
    const publicationDateISO = publicationDate.toISOString()

    video.id = id,
    video.title = trim(String(req.body.title)),
    video.author = trim(String(req.body.author)),
    video.availableResolutions = !isEmpty(req.body.availableResolutions) ? req.body.availableResolutions : null,
    video.canBeDownloaded = req.body.canBeDownloaded || false,
    video.minAgeRestriction = req.body.minAgeRestriction || null,
    video.createdAt = video.createdAt,
    video.publicationDate = req.body.publicationDate || publicationDateISO,

    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .delete('/:id', (req: RequestWithParams<URIParamsVideoModel>, res: Response) => {
    const video = db.videos.find(({ id }) => id === +req.params.id)

    if (!video) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }
    
    db.videos = db.videos.filter(({ id }) => id !== video.id)
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
