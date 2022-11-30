import { PostViewModel } from '../../models'

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

export type RepositoryPostType = {
  findAllPosts: () => Promise<PostViewModel[]>
  findPostById: (id: string) => Promise<PostViewModel | null>
  createdPost: ({ title, shortDescription, content, blogId, blogName }: CreaetPostService) => Promise<PostViewModel>
  updatePost: ({ id, title, shortDescription, content, blogId, blogName }: UpdatePostService) => Promise<boolean>
  deletePostById: (id: string) => Promise<boolean>
}
