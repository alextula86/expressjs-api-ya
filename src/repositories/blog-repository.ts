import { trim } from 'lodash'
import { db } from '../mocks'

import { getNextStrId } from '../utils'

import {
  BlogType,
  CreateBlogModel,
  UpdateBlogModel,
} from '../types'

export const blogsRepository = {
  findAllBlogs: (): BlogType[] => db.blogs,
  findBlogById: (id: string): BlogType | undefined => (
    db.blogs.find((item) => item.id === id)
  ),
  createdBlog: ({ name, description, websiteUrl }: CreateBlogModel): BlogType => {
    const createdBlog: BlogType = {
      id: getNextStrId(),
      name: trim(String(name)),
      description: trim(String(description)),
      websiteUrl: trim(String(websiteUrl)),
    }

    db.blogs.push(createdBlog)

    return createdBlog
  },
  updateBlog: (
    id: string,
    { name, description, websiteUrl }: UpdateBlogModel
    ): boolean => {      
      const updatedBlog = db.blogs.find((item) => item.id === id)

      if (!updatedBlog) {
        return false
      }

      updatedBlog.id = id
      updatedBlog.name = trim(String(name))
      updatedBlog.description = trim(String(description))
      updatedBlog.websiteUrl = trim(String(websiteUrl))

      return true    
  },
  deleteBlogById: (id: string): boolean => {
    const blogById = db.blogs.find(item => item.id === id)

    if (!blogById) {
      return false
    }

    db.blogs = db.blogs.filter(({ id }) => id !== blogById.id)
    return true
  },
}
