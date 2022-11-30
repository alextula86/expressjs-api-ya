import { isEmpty, trim } from 'lodash'
import { db } from '../../mocks'

import { getNextId } from '../../utils'

import { RepositoryVideoType } from '../../types/services'
import { VideoViewModel } from '../../types/models'
import { VideoType } from '../../types'

export const getVideoViewModel = (db: VideoType): VideoViewModel => ({
  id: db.id,
  title: db.title,
  author: db.author,
  availableResolutions: db.availableResolutions,
  canBeDownloaded: db.canBeDownloaded,
  minAgeRestriction: db.minAgeRestriction,
  createdAt: db.createdAt,
  publicationDate: db.publicationDate,
})  

export const videoRepository: RepositoryVideoType = {
  findAllVideos: async () => db.videos.map(getVideoViewModel),
  findVideoById: async (id) => {
    const foundVideo: VideoType | undefined = db.videos.find((item) => item.id === id)

    if (!foundVideo) {
      return null
    }

    return getVideoViewModel(foundVideo)
  },
  createdVideo: async ({ title, author, availableResolutions }) => {
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
  updateVideo: async ({ 
    id, title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate }
    ) => {      
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
  deleteVideoById: async (id) => {
    const videoById = db.videos.find(item => item.id === id)

    if (!videoById) {
      return false
    }

    db.videos = db.videos.filter(({ id }) => id !== videoById.id)
    return true
  },
}
