import { NextFunction, Request, Response } from 'express'
import * as dotenv from 'dotenv'
dotenv.config()
import { userService } from '../services/user-service'
// import { UserAuthViewModel } from '../types'
import { jwtService } from '../application'

export const authBearerMiddleware = async (req: Request & any, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(401).send()
  }

  const [authType, authToken]  = req.headers.authorization.split(' ')

  const userId = await jwtService.getUserIdByToken(authToken)

  if (authType !== 'Bearer' || !userId) {
    return res.status(401).send()
  }

  req.user = await userService.findUserById(userId)
  next()
}
