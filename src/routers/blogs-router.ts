import { Router, Response } from "express";
import { blogsRepository } from '../repositories'
import {
  authMiddleware,
  nameBlogValidation,
  descriptionBlogValidation,
  websiteUrlBlogValidation,
  inputValidationMiddleware,
} from '../middlewares'

import {
  HTTPStatuses,
  BlogType,
  BlogViewModel,
  URIParamsBlogModel,
  CreateBlogModel,
  UpdateBlogModel,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  ErrorsMessageType,
} from '../types'

export const blogsRouter = Router()

const middlewares = [
  authMiddleware,
  nameBlogValidation,
  descriptionBlogValidation,
  websiteUrlBlogValidation,
  inputValidationMiddleware
]

export const getBlogViewModel = (db: BlogType): BlogViewModel => ({
  id: db.id,
  name: db.name,
  description: db.description,
  websiteUrl: db.websiteUrl,
})

blogsRouter
  .get('/', (_, res: Response<BlogViewModel[]>) => {
    const allBlogs = blogsRepository.findAllBlogs()
    const allBlogsResponse = allBlogs.map(getBlogViewModel)
    res.status(HTTPStatuses.SUCCESS200).send(allBlogsResponse)
  })
  .get('/:id', (req: RequestWithParams<URIParamsBlogModel>, res: Response<BlogViewModel>) => {
    const blogoById = blogsRepository.findBlogById(req.params.id)

    if (!blogoById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    const blogoByIdResponse = getBlogViewModel(blogoById)
    res.status(HTTPStatuses.SUCCESS200).send(blogoByIdResponse)
  })
  .post('/', middlewares, (req: RequestWithBody<CreateBlogModel>, res: Response<BlogViewModel | ErrorsMessageType>) => {
    const createdBlog = blogsRepository.createdBlog({
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    })

    const createdBlogResponse = getBlogViewModel(createdBlog)
    res.status(HTTPStatuses.CREATED201).send(createdBlogResponse)
  })
  .put('/:id', middlewares, (req: RequestWithParamsAndBody<URIParamsBlogModel, UpdateBlogModel>, res: Response) => {
    const isBlogUpdated = blogsRepository.updateBlog(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    })

    if (!isBlogUpdated) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .delete('/:id', authMiddleware, (req: RequestWithParams<URIParamsBlogModel>, res: Response) => {
    const isBlogDeleted = blogsRepository.deleteBlogById(req.params.id)

    if (!isBlogDeleted) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }
    
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
