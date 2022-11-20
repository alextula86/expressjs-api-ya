import { isEmpty, trim } from 'lodash'
import { db } from '../mocks'

import { getVideoViewModel, getNextId } from '../utils'

import {
  VideoType,
  CreateVideoModel,
  UpdateVideoModel,
} from '../types'

export const videoRepository = {
  findAllVideos: (): VideoType[] => db.videos,
  findVideoById: (id: number): VideoType | undefined => (
    db.videos.find((item) => item.id === id)
  ),
  createdProduct: ({ title, author, availableResolutions }: CreateVideoModel): VideoType => {
    const createdAtISO = new Date().toISOString()
    const publicationDate = new Date()
    publicationDate.setDate(publicationDate.getDate() + 1)
    const publicationDateISO = publicationDate.toISOString()

    const createdVideo: VideoType = {
      id: getNextId(),
      title: trim(String(title)),
      author: trim(String(author)),
      availableResolutions: !isEmpty(availableResolutions) ? availableResolutions : null,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: createdAtISO,
      publicationDate: publicationDateISO,
    }

    db.videos.push(createdVideo)

    return getVideoViewModel(createdVideo)
  },
  updateVideo: (
    id: number,
    { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate }: UpdateVideoModel
    ): boolean => {      
      const updatedVideo = db.videos.find((item) => item.id === id)
      
      if (!updatedVideo) {
        return false
      }

      const publicationDateNew = new Date()
      publicationDateNew.setDate(publicationDateNew.getDate() + 1)
      const publicationDateISO = publicationDateNew.toISOString()

      updatedVideo.id = id
      updatedVideo.title = trim(String(title))
      updatedVideo.author = trim(String(author))
      updatedVideo.availableResolutions = !isEmpty(availableResolutions) ? availableResolutions : null
      updatedVideo.canBeDownloaded = canBeDownloaded || false
      updatedVideo.minAgeRestriction = minAgeRestriction || null,
      updatedVideo.createdAt = updatedVideo.createdAt
      updatedVideo.publicationDate = publicationDate || publicationDateISO

      return true    
  },
  deleteVideoById: (id: number): boolean => {
    const videoById = db.videos.find(item => item.id === id)

    if (!videoById) {
      return false
    }

    db.videos = db.videos.filter(({ id }) => id !== videoById.id)
    return true
  },
}
