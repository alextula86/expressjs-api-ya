import { PostViewModel, PostsViewModelDetail, QueryPostModel, SortDirection } from '../../models'
import { PostType } from '../../schema'

export type CreaetPostService = {
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
}

export type UpdatePostService = {
  id: string
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
}

export type PostsViewModelDetailArgs = {
  items: PostType[]
  totalCount: number
  pagesCount: number
  page: number
  pageSize: number
}

export type RepositoryPostType = {
  findAllPosts: ({ searchNameTerm, pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection =  SortDirection.ASC}: QueryPostModel) => Promise<PostsViewModelDetail>
  findPostById: (id: string) => Promise<PostViewModel | null>
  createdPost: ({ title, shortDescription, content, blogId, blogName }: CreaetPostService) => Promise<PostViewModel>
  updatePost: ({ id, title, shortDescription, content, blogId, blogName }: UpdatePostService) => Promise<boolean>
  deletePostById: (id: string) => Promise<boolean>
  _getPostViewModel: (dbPosts: PostType) => PostViewModel
  _getPostsViewModelDetail: ({ items, totalCount, pagesCount, page, pageSize }: PostsViewModelDetailArgs) => PostsViewModelDetail
}
