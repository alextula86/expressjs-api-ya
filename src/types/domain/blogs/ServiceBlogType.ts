import { BlogViewModel, PostViewModel, QueryBlogModel } from '../../models'
import { ResponseViewModelDetail } from '../../response'
import { CreaetBlogService, UpdateBlogService, CreaetPostService } from '../../domain'

export type ServiceBlogType = {
  findAllBlogs: ({ searchNameTerm, pageNumber, pageSize, sortBy, sortDirection }: QueryBlogModel) => Promise<ResponseViewModelDetail<BlogViewModel>>
  findBlogById: (id: string) => Promise<BlogViewModel | null>
  findPostsByBlogId: (blogId: string, { searchNameTerm, pageNumber, pageSize, sortBy, sortDirection }: QueryBlogModel) => Promise<ResponseViewModelDetail<PostViewModel>>
  createdBlog: ({ name, description, websiteUrl }: CreaetBlogService) => Promise<BlogViewModel>
  createdPostByBlogId: ({ title, shortDescription, content, blogId, blogName }: CreaetPostService) => Promise<PostViewModel>
  updateBlog: ({ id, name, description, websiteUrl }: UpdateBlogService) => Promise<boolean>
  deleteBlogById: (id: string) => Promise<boolean>
}
