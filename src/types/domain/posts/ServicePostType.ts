import { PostViewModel, QueryPostModel } from '../../models'
import { ResponseViewModelDetail } from '../../response'
import { UpdatePostService, CreaetPostService } from '../../domain'

export type ServicePostType = {
  findAllPosts: ({ searchNameTerm, pageNumber, pageSize, sortBy, sortDirection}: QueryPostModel) => Promise<ResponseViewModelDetail<PostViewModel>>
  findPostById: (id: string) => Promise<PostViewModel | null>
  createdPost: ({ title, shortDescription, content, blogId, blogName }: CreaetPostService) => Promise<PostViewModel>
  updatePost: ({ id, title, shortDescription, content, blogId, blogName }: UpdatePostService) => Promise<boolean>
  deletePostById: (id: string) => Promise<boolean>
}
