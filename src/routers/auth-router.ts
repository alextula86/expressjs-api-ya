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

    // Формируем access и refresh токены
    const { accessToken, refreshToken } = await authService.createUserAuthTokens(user.id)
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)

    await authService.updateRefreshTokenByUserId(user.id, refreshToken)

    const user1 = await userService.findUserById(user.id)

    console.log('login user1', user1)

    // Пишем refresh токен в cookie
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })

    // Возвращаем статус 200 и сформированный access токен
    res.status(HTTPStatuses.SUCCESS200).send({ accessToken })
  })
  .post('/refresh-token', async (req: Request, res: Response) => {
    // res.cookie('refreshToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNjczMjEyNjI4OTQxIiwiaWF0IjoxNjczNDY5NTkxLCJleHAiOjE2NzM1NDE1OTF9.f-idajYl2IEDOBYJGlRp4Eqsp79XQjWLCnhROP5XGeg');

    if (!req.cookies.refreshToken) {
      //console.log('попадаю ли сюда???')
      //console.log('!req.cookies.refreshToken = ', !req.cookies.refreshToken)
      return res.status(401).send()
    }

    //console.log('req.cookies.refreshToken', req.cookies.refreshToken)

    // Верифицируем refresh токен и получаем идентификатор пользователя
    const userId = await authService.checkRefreshToken(req.cookies.refreshToken)

    //console.log('userId', userId)

    // Если идентификатор пользователя не определен, возвращаем статус 401
    if (!userId) {
      return res.status(HTTPStatuses.UNAUTHORIZED401).send()
    }

    // Формируем access и refresh токены
    const { accessToken, refreshToken } = await authService.createUserAuthTokens(userId)

    // Пишем новый refresh токен в cookie
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })

    // Возвращаем статус 200 и сформированный новый access токен
    res.status(HTTPStatuses.SUCCESS200).send({ accessToken })
  })
  .post('/logout', async (req: Request, res: Response) => {
    if (!req.cookies.refreshToken) {
      return res.status(401).send()
    }

    // Верифицируем refresh токен и получаем идентификатор пользователя
    const userId = await authService.checkRefreshToken(req.cookies.refreshToken)

    // Если идентификатор пользователя не определен, возвращаем статус 401
    if (!userId) {
      return res.status(HTTPStatuses.UNAUTHORIZED401).send()
    }

    // Удаляем refresh токен
    await authService.updateRefreshTokenByUserId(userId, '')

    // Удаляем refresh токен из cookie
    res.clearCookie('refreshToken')

    // Возвращаем статус 204
    res.status(HTTPStatuses.NOCONTENT204).send()
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
