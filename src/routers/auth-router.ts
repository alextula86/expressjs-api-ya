import { Router, Response, Request } from 'express'
import { jwtService } from '../application'
import { userService, authService } from '../services'
import {
  authBearerMiddleware,
  loginOrEmailUserValidation,
  passwordUserValidation,
  loginUserValidation,
  emailUserValidation,
  codeUserValidation,
  inputValidationMiddleware,
} from '../middlewares'

import {
  RequestWithBody,
  AuthUserModel,
  AuthAccessTokenModel,
  CreateUserModel,
  RegistrationConfirmationModel,
  RegistrationEmailResendingModel,

  UserViewModel,
  HTTPStatuses,
  ErrorsMessageType,
} from '../types'

export const authRouter = Router()

const middlewaresLogin = [
  loginOrEmailUserValidation,
  passwordUserValidation,
  inputValidationMiddleware,
]

const middlewaresRegistration = [
  loginUserValidation,
  emailUserValidation,
  passwordUserValidation,
  inputValidationMiddleware,
]

authRouter
  .get('/me', authBearerMiddleware, async (req: Request & any, res: Response) => {
    const foundUserById = await userService.findUserById(req.user.userId)  

    res.status(HTTPStatuses.SUCCESS200).send(foundUserById)
  })
  .post('/login', middlewaresLogin, async (req: RequestWithBody<AuthUserModel>, res: Response<AuthAccessTokenModel | ErrorsMessageType>) => {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)

    if (!user) {
      return res.status(HTTPStatuses.UNAUTHORIZED401).send()
    }

    const token = await jwtService.createJWT(user)

    res.status(HTTPStatuses.SUCCESS200).send(token)
  })
  .post('/registration', middlewaresRegistration, async (req: RequestWithBody<CreateUserModel>, res: Response<any | ErrorsMessageType>) => {
    const user = await authService.registerUser({
      login: req.body.login,
      password: req.body.password,
      email: req.body.email,
    })

    if (!user) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }

    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .post('/registration-confirmation', codeUserValidation, async (req: RequestWithBody<RegistrationConfirmationModel>, res: Response<UserViewModel | ErrorsMessageType>) => {
    const isConfirmed = await authService.confirmEmail(req.body.code)
    
    if (!isConfirmed) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }
    
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .post('/registration-email-resending', emailUserValidation, async (req: RequestWithBody<RegistrationEmailResendingModel>, res: Response<UserViewModel | ErrorsMessageType>) => {
    const isResending = await authService.resendingCode(req.body.email) 
    
    if (!isResending) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }
    
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  