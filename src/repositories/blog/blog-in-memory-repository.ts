import { trim } from 'lodash'
import { db } from '../../mocks'

import { getNextStrId } from '../../utils'

import { RepositoryBlogType } from '../../types/services'
import { BlogViewModel } from '../../types/models'
import { BlogType } from '../../types'

export const getBlogViewModel = (db: BlogType): BlogViewModel => ({
  id: db.id,
  name: db.name,
  description: db.description,
  websiteUrl: db.websiteUrl,
  createdAt: db.createdAt,
})

export const blogRepository: RepositoryBlogType = {
  findAllBlogs: async () => db.blogs.map(getBlogViewModel),
  findBlogById: async (id) => {
    const foundBlog: BlogType | undefined = db.blogs.find((item) => item.id === id)

    if (!foundBlog) {
      return null
    }

    return getBlogViewModel(foundBlog)
  },
  createdBlog: async ({ name, description, websiteUrl }) => {
    const createdBlog: BlogType = {
      id: getNextStrId(),
      name: trim(String(name)),
      description: trim(String(description)),
      websiteUrl: trim(String(websiteUrl)),
      createdAt: new Date().toISOString()
    }

    db.blogs.push(createdBlog)

    return getBlogViewModel(createdBlog)
  },
  updateBlog: async ({id, name, description, websiteUrl }) => {      
      const updatedBlog: BlogType | undefined = db.blogs.find((item) => item.id === id)

      if (!updatedBlog) {
        return false
      }

      updatedBlog.id = id
      updatedBlog.name = trim(String(name))
      updatedBlog.description = trim(String(description))
      updatedBlog.websiteUrl = trim(String(websiteUrl))

      return true    
  },
  deleteBlogById: async (id) => {
    const blogById: BlogType | undefined = db.blogs.find(item => item.id === id)

    if (!blogById) {
      return false
    }

    db.blogs = db.blogs.filter(({ id }) => id !== blogById.id)
    return true
  },
}
