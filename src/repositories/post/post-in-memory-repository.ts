import { trim } from 'lodash'
import { db } from '../../mocks'

import { getNextStrId } from '../../utils'

import { RepositoryPostType } from '../../types/services'
import { PostViewModel } from '../../types/models'
import { PostType } from '../../types'

export const getPostViewModel = (dbPost: PostType): PostViewModel => ({
  id: dbPost.id,
  title: dbPost.title,
  shortDescription: dbPost.shortDescription,
  content: dbPost.content,
  blogId: dbPost.blogId,
  blogName: dbPost.blogName,
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
