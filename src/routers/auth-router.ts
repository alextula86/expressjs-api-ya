import { Router, Response } from 'express'
import { userService } from '../domains/user-service'
import {
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
  .post('/login', middlewares, async (req: RequestWithBody<AuthUserModel>, res: Response<ErrorsMessageType>) => {
    const checkResult = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)

    if (!checkResult) {
      return res.status(HTTPStatuses.UNAUTHORIZED401).send()
    }

    res.status(HTTPStatuses.NOCONTENT204).send()
  })
