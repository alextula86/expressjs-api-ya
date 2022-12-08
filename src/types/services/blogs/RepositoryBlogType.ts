import { BlogViewModel, PostViewModel, BlogsViewModelDetail, PostsViewModelDetail, QueryBlogModel, SortDirection } from '../../models'
import { BlogType, PostType } from '../../schema'

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

export type CreaetPostService = {
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
}

export type BlogsViewModelDetailArgs = {
  items: BlogType[]
  totalCount: number
  pagesCount: number
  page: number
  pageSize: number
}

export type PostsViewModelDetailArgs = {
  items: PostType[]
  totalCount: number
  pagesCount: number
  page: number
  pageSize: number
}

export type RepositoryBlogType = {
  findAllBlogs: ({ searchNameTerm, pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection =  SortDirection.ASC}: QueryBlogModel) => Promise<BlogsViewModelDetail>
  findBlogById: (id: string) => Promise<BlogViewModel | null>
  findPostsByBlogId: (blogId: string, { searchNameTerm, pageNumber, pageSize, sortBy, sortDirection }: QueryBlogModel) => Promise<PostsViewModelDetail>
  createdBlog: ({ name, description, websiteUrl }: CreaetBlogService) => Promise<BlogViewModel>
  createdPostByBlogId: ({ title, shortDescription, content, blogId, blogName }: CreaetPostService) => Promise<PostViewModel>
  updateBlog: ({ id, name, description, websiteUrl }: UpdateBlogService) => Promise<boolean>
  deleteBlogById: (id: string) => Promise<boolean>
  _getBlogViewModel: (dbBlog: BlogType) => BlogViewModel
  _getPostViewModel: (dbPosts: PostType) => PostViewModel
  _getBlogsViewModelDetail: ({ items, totalCount, pagesCount, page, pageSize }: BlogsViewModelDetailArgs) => BlogsViewModelDetail
  _getPostsViewModelDetail: ({ items, totalCount, pagesCount, page, pageSize }: PostsViewModelDetailArgs) => PostsViewModelDetail
}
