import { Router } from "express";
import { HTTPStatuses } from '../types'
import { db } from '../mocks'

export const testingRouter = Router()

testingRouter.delete('/all-data', (_, res) => {
  db.videos = []
  db.posts = []
  db.blogs = []
  res.status(HTTPStatuses.NOCONTENT204).send()
})
