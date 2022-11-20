import { VideoType, VideoViewModel } from '../types'

export const getVideoViewModel = (dbVideo: VideoType): VideoViewModel => ({
    id: dbVideo.id,
    title: dbVideo.title,
    author: dbVideo.author,
    availableResolutions: dbVideo.availableResolutions,
    canBeDownloaded: dbVideo.canBeDownloaded,
    minAgeRestriction: dbVideo.minAgeRestriction,
    createdAt: dbVideo.createdAt,
    publicationDate: dbVideo.publicationDate,
  })
  