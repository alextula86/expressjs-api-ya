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
  existsUserByLoginOrEmail,
  existsUserByEmail,
  existsUserByConfirmationCode,
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
  existsUserByLoginOrEmail,
]

const middlewaresRegistrationConfirmation = [
  codeUserValidation,
  existsUserByConfirmationCode,
]

const middlewaresRegistrationEmailResending = [
  emailUserValidation,
  existsUserByEmail,
]

authRouter
  // Получение данных о пользователе
  .get('/me', authBearerMiddleware, async (req: Request & any, res: Response) => {
    // Ищем пользователя по идентификатору, если пользователь не найден то Middleware вернет статус 401
    const foundUserById = await userService.findUserById(req.user.userId)
    // Если пользователь найден возвращаем статус 200 и найденного пользователя
    res.status(HTTPStatuses.SUCCESS200).send(foundUserById)
  })
  // Аутентификация пользователя
  .post('/login', middlewaresLogin, async (req: RequestWithBody<AuthUserModel>, res: Response<AuthAccessTokenModel | ErrorsMessageType>) => {
    // Проверяем правильность ввода логина/email и пароля
    const user = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)

    // Если логин/email и пароль введен неверно, возвращаем статус 401
    if (!user) {
      return res.status(HTTPStatuses.UNAUTHORIZED401).send()
    }

    // Формируем jwt токен
    const token = await jwtService.createJWT(user)

    // Возвращаем статус 200 и сформированный токен
    res.status(HTTPStatuses.SUCCESS200).send(token)
  })
  // Регистрация пользователя
  .post('/registration', middlewaresRegistration, async (req: RequestWithBody<CreateUserModel>, res: Response<UserViewModel | ErrorsMessageType>) => {
    // Добавляем пользователя и отправляем письмо с кодом для подтверждения регистрации
    const user = await authService.registerUser({
      login: req.body.login,
      password: req.body.password,
      email: req.body.email,
    })

    // Если по каким-либо причинам email с кодом не отправлен и пользователь не создался возвращаем статус 400
    if (!user) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }

    // В случае отправки email с кодом и создания пользователя возвращаем статус 204
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  // Подтверждение email по коду
  .post('/registration-confirmation', middlewaresRegistrationConfirmation, async (req: RequestWithBody<RegistrationConfirmationModel>, res: Response<UserViewModel | ErrorsMessageType>) => {
    // Отправляем код подтверждения email
    const isConfirmed = await authService.confirmEmail(req.body.code)

    // Если код подтверждения email не отправлен, возвращаем статус 400
    if (!isConfirmed) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }

    // Если код подтверждения email отправлен успешно, возвращаем статус 204
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  // Повторная отправка кода подтверждения email
  .post('/registration-email-resending', middlewaresRegistrationEmailResending, async (req: RequestWithBody<RegistrationEmailResendingModel>, res: Response<UserViewModel | ErrorsMessageType>) => {
    // Повторно формируем код подтверждения email, обновляем код у пользователя и отправляем письмо
    const isResending = await authService.resendingCode(req.body.email)

    // Если новый код подтверждения email не сформирован или не сохранен для пользователя или письмо не отправлено,
    // возвращаем статус 400
    if (!isResending) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }

    // Если новый код подтверждения email сформирован, сохранен для пользователя и письмо отправлено,
    // возвращаем статус 204
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
