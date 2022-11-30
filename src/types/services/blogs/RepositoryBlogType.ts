import { BlogViewModel } from '../../models'

export type CreaetBlogService = {
  name: string
  description: string
  websiteUrl: string
}

export type UpdateBlogService = {
  id: string
  name: string
  description: string
  websiteUrl: string
}

export type RepositoryBlogType = {
  findAllBlogs: () => Promise<BlogViewModel[]>
  findBlogById: (id: string) => Promise<BlogViewModel | null>
  createdBlog: ({ name, description, websiteUrl }: CreaetBlogService) => Promise<BlogViewModel> 
  updateBlog: ({ id, name, description, websiteUrl }: UpdateBlogService) => Promise<boolean>
  deleteBlogById: (id: string) => Promise<boolean>
}
