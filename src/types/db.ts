import { VideoType } from './schema/video'
import { PostType } from './schema/post'
import { BlogType } from './schema/blog'

export type DB = {
  videos: VideoType[]
  blogs: BlogType[]
  posts: PostType[]
}
