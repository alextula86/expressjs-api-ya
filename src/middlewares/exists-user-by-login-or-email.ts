import { NextFunction, Response } from 'express'
import { authService } from '../services/auth-service'

import { RequestWithBody, RegistrationAuthService, ErrorsMessageType } from '../types'

export const existsUserByLoginOrEmail = async (req: RequestWithBody<RegistrationAuthService>, res: Response<ErrorsMessageType>, next: NextFunction) => {
  // Ищем пользователя по логину
  const userByLogin = await authService.checkExistsUserByLoginOrEmail(req.body.login)
  // Ищем пользователя по email
  const userByEmail = await authService.checkExistsUserByLoginOrEmail(req.body.email)

  // Если пользователь по логину или email найден,
  // Возвращаем статус 400 и сообщение об ошибке
  if (userByLogin || userByEmail) {
    return res.status(400).send()
  }

  next()
}
