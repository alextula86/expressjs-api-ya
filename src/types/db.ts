import { VideoType } from './video'

export enum HTTPStatuses {
  SUCCESS200 = 200,
  CREATED201 = 201,
  NOCONTENT204 = 204,
  BADREQUEST400 = 400,
  NOTFOUND404 = 404,
}

export type DB = {
  videos: VideoType[]
}
