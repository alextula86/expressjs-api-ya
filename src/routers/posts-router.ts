import { Router, Response } from 'express'
import { isEmpty } from 'lodash'
import { postService } from '../domains/post-service'
import { blogService } from '../domains/blog-service'
import {
  authMiddleware,
  titlePostValidation,
  shortPostDescriptionValidation,
  contentPostValidation,
  blogIdPostValidation,
  inputValidationMiddleware,
} from '../middlewares'

import {
  RequestWithBody,
  RequestWithQuery,
  RequestWithParams,
  RequestWithParamsAndBody,
  URIParamsPostModel,
  QueryPostModel,
  CreatePostModel,
  UpdatePostModel,
  PostViewModel,
  ResponseViewModelDetail,
  PostType,
  HTTPStatuses,
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
  .get('/', async (req: RequestWithQuery<QueryPostModel>, res: Response<ResponseViewModelDetail<PostViewModel>>) => {
    const allPosts = await postService.findAllPosts({
      searchNameTerm: req.query.searchNameTerm,
      pageNumber: req.query.pageNumber, 
      pageSize: req.query.pageSize,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
    })
    
    res.status(HTTPStatuses.SUCCESS200).send(allPosts)
  })
  .get('/:id', async (req: RequestWithParams<URIParamsPostModel>, res: Response<PostViewModel>) => {
    const postById = await postService.findPostById(req.params.id)

    if (!postById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    res.status(HTTPStatuses.SUCCESS200).send(postById)
  })
  .post('/', middlewares, async (req: RequestWithBody<CreatePostModel>, res: Response<PostViewModel | ErrorsMessageType>) => {
    const blogById = await blogService.findBlogById(req.body.blogId)

    if (isEmpty(blogById)) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }

    const createdPost = await postService.createdPost({
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: blogById.id,
      blogName: blogById.name,
    })

    res.status(HTTPStatuses.CREATED201).send(createdPost)
  })
  .put('/:id', middlewares, async (req: RequestWithParamsAndBody<URIParamsPostModel, UpdatePostModel>, res: Response<boolean>) => {
    const blogById = await blogService.findBlogById(req.body.blogId)

    if (isEmpty(blogById)) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }

    const isPostUpdated = await postService.updatePost({
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
  .delete('/:id', authMiddleware, async (req: RequestWithParams<URIParamsPostModel>, res: Response<boolean>) => {
    const isPostDeleted = await postService.deletePostById(req.params.id)

    if (!isPostDeleted) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }
    
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
