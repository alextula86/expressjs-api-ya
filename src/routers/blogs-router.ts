import { Router, Response } from "express";
import { blogRepository } from '../repositories/blog/blog-db-repository'
import {
  authMiddleware,
  nameBlogValidation,
  descriptionBlogValidation,
  websiteUrlBlogValidation,
  inputValidationMiddleware,
} from '../middlewares'

import {
  HTTPStatuses,
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

blogsRouter
  .get('/', async (_, res: Response<BlogViewModel[]>) => {
    const allBlogs = await blogRepository.findAllBlogs()
    res.status(HTTPStatuses.SUCCESS200).send(allBlogs)
  })
  .get('/:id', async (req: RequestWithParams<URIParamsBlogModel>, res: Response<BlogViewModel>) => {
    const blogoById = await blogRepository.findBlogById(req.params.id)

    if (!blogoById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    res.status(HTTPStatuses.SUCCESS200).send(blogoById)
  })
  .post('/', middlewares, async (req: RequestWithBody<CreateBlogModel>, res: Response<BlogViewModel | ErrorsMessageType>) => {
    const createdBlog = await blogRepository.createdBlog({
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    })

    res.status(HTTPStatuses.CREATED201).send(createdBlog)
  })
  .put('/:id', middlewares, async (req: RequestWithParamsAndBody<URIParamsBlogModel, UpdateBlogModel>, res: Response) => {
    const isBlogUpdated = await blogRepository.updateBlog({
      id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    })

    if (!isBlogUpdated) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .delete('/:id', authMiddleware, async (req: RequestWithParams<URIParamsBlogModel>, res: Response) => {
    const isBlogDeleted = await blogRepository.deleteBlogById(req.params.id)

    if (!isBlogDeleted) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }
    
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
