import { BlogViewModel, PostViewModel, QueryBlogModel } from '../models'
import { BlogType, PostType } from '../schema'
import { ResponseViewModelDetail } from '../response'
import { UpdateBlogService } from '../domain/blogs'

export type RepositoryBlogType = {
  findAllBlogs: ({ searchNameTerm, pageNumber, pageSize, sortBy, sortDirection }: QueryBlogModel) => Promise<ResponseViewModelDetail<BlogViewModel>>
  findBlogById: (id: string) => Promise<BlogViewModel | null>
  findPostsByBlogId: (blogId: string, { searchNameTerm, pageNumber, pageSize, sortBy, sortDirection }: QueryBlogModel) => Promise<ResponseViewModelDetail<PostViewModel>>
  createdBlog: (createdBlog: BlogType) => Promise<BlogViewModel>
  createdPostByBlogId: (createdPost: PostType) => Promise<PostViewModel>
  updateBlog: ({ id, name, description, websiteUrl }: UpdateBlogService) => Promise<boolean>
  deleteBlogById: (id: string) => Promise<boolean>
  _getBlogViewModel: (dbBlog: BlogType) => BlogViewModel
  _getPostViewModel: (dbPosts: PostType) => PostViewModel
  _getBlogsViewModelDetail: ({ items, totalCount, pagesCount, page, pageSize }: ResponseViewModelDetail<BlogType>) => ResponseViewModelDetail<BlogViewModel>
  _getPostsViewModelDetail: ({ items, totalCount, pagesCount, page, pageSize }: ResponseViewModelDetail<PostType>) => ResponseViewModelDetail<PostViewModel>
}
