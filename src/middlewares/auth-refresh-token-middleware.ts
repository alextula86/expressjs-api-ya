import { NextFunction, Request, Response } from 'express'
import * as dotenv from 'dotenv'
dotenv.config()
import { userService, authService, deviceService } from '../services'
import { HTTPStatuses } from '../types'

export const authRefreshTokenMiddleware = async (req: Request & any, res: Response, next: NextFunction) => {
  res.send('req.cookies.refreshToken ' + req.cookies.refreshToken)
  
  if (!req.cookies.refreshToken) {
    return res.status(HTTPStatuses.UNAUTHORIZED401).send()
  }

  // Верифицируем refresh токен и получаем идентификатор пользователя
  const refreshTokenData = await authService.checkRefreshToken(req.cookies.refreshToken)

  // Если идентификатор пользователя не определен, возвращаем статус 401
  if (!refreshTokenData || !refreshTokenData.userId || !refreshTokenData.deviceId) {
    return res.status(HTTPStatuses.UNAUTHORIZED401).send()
  }

  req.user = await userService.findUserById(refreshTokenData.userId) 
  req.device = await deviceService.findDeviceById(refreshTokenData.deviceId) 

  next()
}
