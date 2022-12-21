import { trim } from 'lodash'
import { getNextStrId } from '../utils'
import { CommentType, SortDirection } from '../types'
import { commentRepository } from '../repositories/comment/comment-db-repository'
import { ServiceCommentType } from '../types/domain/comments'

export const commentService: ServiceCommentType = {
  async findAllCommentsByPostId(postId: string, {
    pageNumber,
    pageSize,
    sortBy = 'createdAt',
    sortDirection = SortDirection.DESC,
  }) {
    const foundAllComments = await commentRepository.findAllCommentsByPostId(postId, {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    })

    return foundAllComments
  },  
  async findCommentById(id: string) {
    const foundCommentById = await commentRepository.findCommentById(id)

    return foundCommentById
  },
  async createdComment({ content, postId, userId, userLogin }) {
    const newComment: CommentType = {
      id: getNextStrId(),
      content: trim(String(content)),
      postId,
      userId,
      userLogin,  
      createdAt: new Date().toISOString(),
    }

    const createdComment = await commentRepository.createdComment(newComment)

    return createdComment
  },  
  async updateComment({ id, content }) {
    const updatedComment = {
      id,
      content: trim(String(content)),
    }

    const isUpdatedComment = await commentRepository.updateComment(updatedComment)

    return isUpdatedComment
  },
  async deleteCommentById(id) {
    const isDeleteCommentById = await commentRepository.deleteCommentById(id)

    return isDeleteCommentById
  },
}
