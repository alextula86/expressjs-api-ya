export type CreatePostModel = {
  title: string
  shortDescription: string
  content: string
  blogId: string
}

export type CreatePostModelWithoutBlogId = {
  title: string
  shortDescription: string
  content: string
}
