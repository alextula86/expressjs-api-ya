import { PostViewModel, QueryPostModel } from '../models'
import { PostType } from '../schema'
import { ResponseViewModelDetail } from '../response'
import { UpdatePostService } from '../domain'

export type RepositoryPostType = {
  findAllPosts: ({ searchNameTerm, pageNumber, pageSize, sortBy, sortDirection }: QueryPostModel) => Promise<ResponseViewModelDetail<PostViewModel>>
  findPostById: (id: string) => Promise<PostViewModel | null>
  createdPost: (createdPost: PostType) => Promise<PostViewModel>
  updatePost: ({ id, title, shortDescription, content, blogId, blogName }: UpdatePostService) => Promise<boolean>
  deletePostById: (id: string) => Promise<boolean>
  _getPostViewModel: (dbPost: PostType) => PostViewModel
  _getPostsViewModelDetail: ({ items, totalCount, pagesCount, page, pageSize }: ResponseViewModelDetail<PostType>) => ResponseViewModelDetail<PostViewModel>
}
