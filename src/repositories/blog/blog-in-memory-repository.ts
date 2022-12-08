import { trim } from 'lodash'
import { db } from '../../mocks'

import { getNextStrId } from '../../utils'

import { RepositoryBlogType } from '../../types/services'
import { BlogType, PostType } from '../../types'

export const blogRepository: RepositoryBlogType = {
  async findAllBlogs() {
    return this._getBlogsViewModelDetail(db.blogs)
  },
  async findBlogById(id) {
    const foundBlog: BlogType | undefined = db.blogs.find((item) => item.id === id)

    if (!foundBlog) {
      return null
    }

    return this._getBlogViewModel(foundBlog)
  },
  async findPostsByBlogId(blogId) {
    const posts: PostType[] = db.posts.filter((item) => item.id === blogId)

    return this._getPostsViewModelDetail(posts)
  },  
  async createdBlog({ name, description, websiteUrl }) {
    const createdBlog: BlogType = {
      id: getNextStrId(),
      name: trim(String(name)),
      description: trim(String(description)),
      websiteUrl: trim(String(websiteUrl)),
      createdAt: new Date().toISOString()
    }

    db.blogs.push(createdBlog)

    return this._getBlogViewModel(createdBlog)
  },
  async createdPostByBlogId({ title, shortDescription, content, blogId, blogName }) {
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

    return this._getPostViewModel(createdPost)
  },
  async updateBlog({id, name, description, websiteUrl }) {      
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
  async deleteBlogById(id) {
    const blogById: BlogType | undefined = db.blogs.find(item => item.id === id)

    if (!blogById) {
      return false
    }

    db.blogs = db.blogs.filter(({ id }) => id !== blogById.id)
    return true
  },
  _getBlogViewModel(dbBlog) {    
    return {
      id: dbBlog.id,
      name: dbBlog.name,
      description: dbBlog.description,
      websiteUrl: dbBlog.websiteUrl,
      createdAt: dbBlog.createdAt,
    }
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
  _getBlogsViewModelDetail(dbBlogs) {
    return {
      pagesCount: 0,
      page: 0,
      pageSize: 0,
      totalCount: 0,
      items: dbBlogs.map(blog => ({
        id: blog.id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
      })),
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
