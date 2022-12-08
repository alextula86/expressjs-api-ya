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
  async findAllPosts() {
    return this._getPostsViewModelDetail(db.posts)
  },
  async findPostById(id) {
    const foundPost: PostType | undefined = db.posts.find((item) => item.id === id)

    if (!foundPost) {
      return null
    }

    return getPostViewModel(foundPost)
  },  
  async createdPost({ title, shortDescription, content, blogId, blogName }) {
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
  async updatePost({ id, title, shortDescription, content, blogId, blogName }) {  
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
  async deletePostById(id) {
    const postById: PostType | undefined = db.posts.find(item => item.id === id)

    if (!postById) {
      return false
    }

    db.posts = db.posts.filter(({ id }) => id !== postById.id)
    return true
  },
  _getPostViewModel(dbPost) {
    return {
      id: dbPost.id,
      title: dbPost.title,
      shortDescription: dbPost.shortDescription,
      content: dbPost.content,
      blogId: dbPost.blogId,
      blogName: dbPost.blogName,
      createdAt: dbPost.createdAt,
    }
  },
  _getPostsViewModelDetail(dbPosts) {
    return {
      pagesCount: 0,
      page: 0,
      pageSize: 0,
      totalCount: 0,
      items: dbPosts.map(post => ({
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
      })),
    }
  },    
}
