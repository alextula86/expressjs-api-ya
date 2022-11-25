export enum AvailableResolutions {
    P144 = 'P144', 
    P240 = 'P240', 
    P360 = 'P360', 
    P480 = 'P480',
    P720 = 'P720', 
    P1080 = 'P1080', 
    P1440 = 'P1440', 
    P2160 = 'P2160',
  }
  
  export type VideoType = {
    id: number
    title: string
    author: string
    availableResolutions: AvailableResolutions[] | null
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
  }

  /*export type ErrorsMessagesType = {
    message: string,
    field: string
  }

  export type ErrorsMessageType = { errorsMessages: ErrorsMessagesType[] }*/