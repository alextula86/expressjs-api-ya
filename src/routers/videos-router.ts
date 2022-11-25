import { Router, Response } from "express";
import { isEmpty } from 'lodash'
import { videoRepository } from '../repositories'
import { getVideoErrors } from '../errors'
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

export const videosRouter = Router()

export const getVideoViewModel = (db: VideoType): VideoViewModel => ({
  id: db.id,
  title: db.title,
  author: db.author,
  availableResolutions: db.availableResolutions,
  canBeDownloaded: db.canBeDownloaded,
  minAgeRestriction: db.minAgeRestriction,
  createdAt: db.createdAt,
  publicationDate: db.publicationDate,
})  

videosRouter
  .get('/', (_, res: Response<VideoViewModel[]>) => {
    const allVideos = videoRepository.findAllVideos()
    const allVideosResponse = allVideos.map(getVideoViewModel)
    res.status(HTTPStatuses.SUCCESS200).send(allVideosResponse)
  })
  .get('/:id', (req: RequestWithParams<URIParamsVideoModel>, res: Response<VideoViewModel>) => {
    const videoById = videoRepository.findVideoById(+req.params.id)

    if (!videoById) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }

    const videoByIdResponse = getVideoViewModel(videoById)
    res.status(HTTPStatuses.SUCCESS200).send(videoByIdResponse)
  })
  .post('/', (req: RequestWithBody<CreateVideoModel>, res: Response<VideoViewModel | ErrorsMessageType>) => {
    const errors = getVideoErrors(req.body)

    if (!isEmpty(errors.errorsMessages)) {
      res.status(HTTPStatuses.BADREQUEST400).send(errors)
      return
    }

    const createdVideo = videoRepository.createdVideo({
      title: req.body.title,
      author: req.body.author,
      availableResolutions: req.body.availableResolutions,
    })

    const createdVideoResponse = getVideoViewModel(createdVideo)
    res.status(HTTPStatuses.CREATED201).send(createdVideoResponse)
  })
  .put('/:id', (req: RequestWithParamsAndBody<URIParamsVideoModel, UpdateVideoModel>, res: Response) => {
    const errors = getVideoErrors(req.body)

    if (!isEmpty(errors.errorsMessages)) {
      res.status(HTTPStatuses.BADREQUEST400).send(errors)
      return
    }

    const isVideoUpdated = videoRepository.updateVideo(+req.params.id, {
      title: req.body.title,
      author: req.body.author,
      availableResolutions: req.body.availableResolutions,
      canBeDownloaded: req.body.canBeDownloaded,
      minAgeRestriction: req.body.minAgeRestriction,
      publicationDate: req.body.publicationDate,
    })

    if (!isVideoUpdated) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }

    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .delete('/:id', (req: RequestWithParams<URIParamsVideoModel>, res: Response) => {
    const isVideoDeleted = videoRepository.deleteVideoById(+req.params.id)

    if (!isVideoDeleted) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }
    
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
