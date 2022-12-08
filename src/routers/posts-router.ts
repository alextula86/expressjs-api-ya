import { Router, Response } from "express";
import { isEmpty } from 'lodash'
import { postRepository } from '../repositories/post/post-db-repository'
import { blogRepository } from '../repositories/blog/blog-db-repository'
import {
  authMiddleware,
  titlePostValidation,
  shortPostDescriptionValidation,
  contentPostValidation,
  blogIdPostValidation,
  inputValidationMiddleware,
} from '../middlewares'

import {
  HTTPStatuses,
  PostViewModel,
  PostsViewModelDetail,
  URIParamsPostModel,
  QueryPostModel,
  CreatePostModel,
  UpdatePostModel,
  RequestWithBody,
  RequestWithQuery,
  RequestWithParams,
  RequestWithParamsAndBody,
  ErrorsMessageType,
} from '../types'

export const postsRouter = Router()

const middlewares = [
  authMiddleware,
  titlePostValidation,
  shortPostDescriptionValidation,
  contentPostValidation,
  blogIdPostValidation,
  inputValidationMiddleware,
]

postsRouter
  .get('/', async (req: RequestWithQuery<QueryPostModel>, res: Response<PostsViewModelDetail>) => {
    const allPosts = await postRepository.findAllPosts({
      searchNameTerm: req.query.searchNameTerm,
      pageNumber: req.query.pageNumber, 
      pageSize: req.query.pageSize,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
    })
    
    res.status(HTTPStatuses.SUCCESS200).send(allPosts)
  })
  .get('/:id', async (req: RequestWithParams<URIParamsPostModel>, res: Response<PostViewModel>) => {
    const postById = await postRepository.findPostById(req.params.id)

    if (!postById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    res.status(HTTPStatuses.SUCCESS200).send(postById)
  })
  .post('/', middlewares, async (req: RequestWithBody<CreatePostModel>, res: Response<PostViewModel | ErrorsMessageType>) => {
    const blogById = await blogRepository.findBlogById(req.body.blogId)

    if (isEmpty(blogById)) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }

    const createdPost = await postRepository.createdPost({
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: blogById.id,
      blogName: blogById.name,
    })

    res.status(HTTPStatuses.CREATED201).send(createdPost)
  })
  .put('/:id', middlewares, async (req: RequestWithParamsAndBody<URIParamsPostModel, UpdatePostModel>, res: Response) => {
    const blogById = await blogRepository.findBlogById(req.body.blogId)

    if (isEmpty(blogById)) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }

    const isPostUpdated = await postRepository.updatePost({
      id: req.params.id,
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: blogById.id,
      blogName: blogById.name,
    })

    if (!isPostUpdated) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .delete('/:id', authMiddleware, async (req: RequestWithParams<URIParamsPostModel>, res: Response) => {
    const isPostDeleted = await postRepository.deletePostById(req.params.id)

    if (!isPostDeleted) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }
    
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
