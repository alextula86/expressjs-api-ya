import { Router, Response } from "express";
import { isEmpty } from 'lodash'
import { videoRepository } from '../repositories/video/video-repository'
import { getVideoErrors } from '../errors'
import {
  HTTPStatuses,
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

videosRouter
  .get('/', async (_, res: Response<VideoViewModel[]>) => {
    const allVideos = await videoRepository.findAllVideos()
    res.status(HTTPStatuses.SUCCESS200).send(allVideos)
  })
  .get('/:id', async (req: RequestWithParams<URIParamsVideoModel>, res: Response<VideoViewModel>) => {
    const videoById = await videoRepository.findVideoById(+req.params.id)

    if (!videoById) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }

    res.status(HTTPStatuses.SUCCESS200).send(videoById)
  })
  .post('/', async (req: RequestWithBody<CreateVideoModel>, res: Response<VideoViewModel | ErrorsMessageType>) => {
    const errors = getVideoErrors(req.body)

    if (!isEmpty(errors.errorsMessages)) {
      return res.status(HTTPStatuses.BADREQUEST400).send(errors)
    }

    const createdVideo = await videoRepository.createdVideo({
      title: req.body.title,
      author: req.body.author,
      availableResolutions: req.body.availableResolutions,
    })

    res.status(HTTPStatuses.CREATED201).send(createdVideo)
  })
  .put('/:id', async (req: RequestWithParamsAndBody<URIParamsVideoModel, UpdateVideoModel>, res: Response) => {
    const errors = getVideoErrors(req.body)

    if (!isEmpty(errors.errorsMessages)) {
      return res.status(HTTPStatuses.BADREQUEST400).send(errors)
    }

    const isVideoUpdated = await videoRepository.updateVideo({
      id: +req.params.id,
      title: req.body.title,
      author: req.body.author,
      availableResolutions: req.body.availableResolutions,
      canBeDownloaded: req.body.canBeDownloaded,
      minAgeRestriction: req.body.minAgeRestriction,
      publicationDate: req.body.publicationDate,
    })

    if (!isVideoUpdated) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .delete('/:id', async (req: RequestWithParams<URIParamsVideoModel>, res: Response) => {
    const isVideoDeleted = await videoRepository.deleteVideoById(+req.params.id)

    if (!isVideoDeleted) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }
    
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
