import { Router, Response, Request } from 'express'
import { jwtService } from '../application'
import { userService } from '../domains'
import {
  authBearerMiddleware,
  loginOrEmailUserValidation,
  passwordUserValidation,
  inputValidationMiddleware,
} from '../middlewares'

import {
  AuthUserModel,
  RequestWithBody,
  HTTPStatuses,
  ErrorsMessageType,
} from '../types'

export const authRouter = Router()

const middlewares = [
  loginOrEmailUserValidation,
  passwordUserValidation,
  inputValidationMiddleware,
]

authRouter
  .post('/login', middlewares, async (req: RequestWithBody<AuthUserModel>, res: Response<{ token: string } | ErrorsMessageType>) => {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)

    if (!user) {
      return res.status(HTTPStatuses.UNAUTHORIZED401).send()
    }

    const token = await jwtService.createJWT(user)

    res.status(HTTPStatuses.SUCCESS200).send(token)
  })
  .get('/me', authBearerMiddleware, async (req: Request & any, res: Response) => {
    const foundUserById = await userService.findUserById(req.user.userId)  

    res.status(HTTPStatuses.SUCCESS200).send(foundUserById)
  })
