import { NextFunction, Request, Response } from "express";
import * as dotenv from 'dotenv'
dotenv.config()

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const [authType, authInBase64] = req.headers.authorization.split(' ')
    const authToString =  Buffer.from(authInBase64, 'base64').toString('utf8')

    const [login, password] = authToString.split(':')

    if (authType !== 'Basic' && login !== process.env.LOGIN && password !== process.env.PASSWORD) {
      return res.status(401).send()
    }

    next()
  } else {
    return res.status(401).send()
  }
}
