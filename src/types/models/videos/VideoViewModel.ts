import {
  AvailableResolutions,
} from '../..'
    
export type VideoViewModel = {
  id: number
  title: string
  author: string
  availableResolutions: AvailableResolutions[] | null
  canBeDownloaded: boolean
  minAgeRestriction: number | null
  createdAt: string
  publicationDate: string
}
