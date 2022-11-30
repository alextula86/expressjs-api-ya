import { trim } from 'lodash'
import { db } from '../../mocks'

import { getNextStrId } from '../../utils'

import { RepositoryPostType } from '../../types/services'
import { PostViewModel } from '../../types/models'
import { PostType } from '../../types'

export const getPostViewModel = (db: PostType): PostViewModel => ({
  id: db.id,
  title: db.title,
  shortDescription: db.shortDescription,
  content: db.content,
  blogId: db.blogId,
  blogName: db.blogName,
  createdAt: db.createdAt,
})

export const postRepository: RepositoryPostType = {
  findAllPosts: async () => db.posts.map(getPostViewModel),
  findPostById: async (id) => {
    const foundPost: PostType | undefined = db.posts.find((item) => item.id === id)

    if (!foundPost) {
      return null
    }

    return getPostViewModel(foundPost)
  },  
  createdPost: async ({ title, shortDescription, content, blogId, blogName }) => {
    const createdPost: PostType = {
      id: getNextStrId(),
      title: trim(String(title)),
      shortDescription: trim(String(shortDescription)),
      content: trim(String(content)),
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
    }

    db.posts.push(createdPost)

    return getPostViewModel(createdPost)
  },
  updatePost: async ({ id, title, shortDescription, content, blogId, blogName })=> {  
      const updatedPost: PostType | undefined = db.posts.find((item) => item.id === id)
      
      if (!updatedPost) {
        return false
      }

      updatedPost.id = id
      updatedPost.title = trim(String(title))
      updatedPost.shortDescription = trim(String(shortDescription))
      updatedPost.content = trim(String(content))
      updatedPost.blogId = blogId
      updatedPost.blogName = blogName

      return true    
  },
  deletePostById: async (id) => {
    const postById: PostType | undefined = db.posts.find(item => item.id === id)

    if (!postById) {
      return false
    }

    db.posts = db.posts.filter(({ id }) => id !== postById.id)
    return true
  },
}
