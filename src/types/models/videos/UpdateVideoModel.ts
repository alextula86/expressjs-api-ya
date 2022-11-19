import {
  AvailableResolutions,
} from '../..'

export type UpdateVideoModel = {
  title: string
  author: string
  availableResolutions: AvailableResolutions[] | null
  canBeDownloaded?: boolean
  minAgeRestriction?: number | null
  publicationDate?: string
}