import { trim } from 'lodash'
import { postCollection } from '../db'

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
  findAllPosts: async () => {
    const blogs = await postCollection.find().toArray()

    return blogs.map(getPostViewModel)
  },
  findPostById: async (id) => {
    const foundPost: PostType | null = await postCollection.findOne({ id })

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

    await postCollection.insertOne(createdPost)

    return getPostViewModel(createdPost)
  },
  updatePost: async ({ id, title, shortDescription, content, blogId, blogName })=> {  
    const { matchedCount } = await postCollection.updateOne({ id }, {
      $set: {
        title: trim(String(title)),
        shortDescription: trim(String(shortDescription)),
        content: trim(String(content)),
        blogId,
        blogName,
      }
    })

    return matchedCount === 1   
  },
  deletePostById: async (id) => {
    const { deletedCount } = await postCollection.deleteOne({ id })

    return deletedCount === 1
  },
}
