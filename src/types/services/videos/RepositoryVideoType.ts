import { VideoViewModel } from '../../models'
import { AvailableResolutions } from '../../schema'

export type CreaetVideoService = {
  title: string
  author: string
  availableResolutions: AvailableResolutions[] | null
}

export type UpdateVideoService = {
  id: number
  title: string
  author: string
  availableResolutions: AvailableResolutions[] | null
  canBeDownloaded?: boolean
  minAgeRestriction?: number | null
  publicationDate?: string
}

export type RepositoryVideoType = {
  findAllVideos: () => Promise<VideoViewModel[]>
  findVideoById: (id: number) => Promise<VideoViewModel | null>
  createdVideo: ({ title, author, availableResolutions }: CreaetVideoService) => Promise<VideoViewModel> 
  updateVideo: ({ id, title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate }: UpdateVideoService) => Promise<boolean>
  deleteVideoById: (id: number) => Promise<boolean>
}
