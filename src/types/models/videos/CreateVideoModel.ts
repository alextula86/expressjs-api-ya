import {
  AvailableResolutions,
} from '../..'

export type CreateVideoModel = {
  title: string
  author: string
  availableResolutions: AvailableResolutions[] | null
}
