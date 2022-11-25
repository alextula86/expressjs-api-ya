import { Router, Response } from "express";
import { isEmpty } from 'lodash'
import { postRepository, blogsRepository } from '../repositories'
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
  PostType,
  PostViewModel,
  URIParamsPostModel,
  CreatePostModel,
  UpdatePostModel,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  ErrorsMessageType,
} from '../types'

export const postsRouter = Router()

export const getPostViewModel = (dbPost: PostType): PostViewModel => ({
  id: dbPost.id,
  title: dbPost.title,
  shortDescription: dbPost.shortDescription,
  content: dbPost.content,
  blogId: dbPost.blogId,
  blogName: dbPost.blogName,
})

const middlewares = [
  authMiddleware,
  titlePostValidation,
  shortPostDescriptionValidation,
  contentPostValidation,
  blogIdPostValidation,
  inputValidationMiddleware,
]

postsRouter
  .get('/', (_, res: Response<PostViewModel[]>) => {
    const allPosts = postRepository.findAllPosts()
    const allPostsResponse = allPosts.map(getPostViewModel)
    res.status(HTTPStatuses.SUCCESS200).send(allPostsResponse)
  })
  .get('/:id', (req: RequestWithParams<URIParamsPostModel>, res: Response<PostViewModel>) => {
    const postById = postRepository.findPostById(req.params.id)

    if (!postById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    const postByIdResponse = getPostViewModel(postById)
    res.status(HTTPStatuses.SUCCESS200).send(postByIdResponse)
  })
  .post('/', middlewares, (req: RequestWithBody<CreatePostModel>, res: Response<PostViewModel | ErrorsMessageType>) => {
    const blogById = blogsRepository.findBlogById(req.body.blogId)

    if (isEmpty(blogById)) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }

    const createdPost = postRepository.createdPost({
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: blogById.id,
      blogName: blogById.name,
    })

    const createdPostResponse = getPostViewModel(createdPost)
    res.status(HTTPStatuses.CREATED201).send(createdPostResponse)
  })
  .put('/:id', middlewares, (req: RequestWithParamsAndBody<URIParamsPostModel, UpdatePostModel>, res: Response) => {
    const blogById = blogsRepository.findBlogById(req.body.blogId)

    if (isEmpty(blogById)) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }

    const isPostUpdated = postRepository.updatePost(req.params.id, {
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
  .delete('/:id', authMiddleware, (req: RequestWithParams<URIParamsPostModel>, res: Response) => {
    const isPostDeleted = postRepository.deletePostById(req.params.id)

    if (!isPostDeleted) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }
    
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
