import jwt from 'jsonwebtoken'
import { settings } from '../settings'

export const jwtService = {
  async createAccessToken (userId: string) {
    const accessToken = jwt.sign({ userId }, settings.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
    return accessToken
  },
  async createRefreshToken (userId: string) {
    const refreshToken = jwt.sign({ userId }, settings.REFRESH_TOKEN_SECRET, { expiresIn: '20s' })
    return refreshToken
  },   
  async getUserIdByAccessToken (token: string) {
    try {
      const result: any = jwt.verify(token, settings.ACCESS_TOKEN_SECRET)
      return result.userId
    } catch (error) {
      return null
    }
  },
  async getUserIdByRefreshToken (token: string) {
    try {
      const result: any = jwt.verify(token, settings.REFRESH_TOKEN_SECRET)
      return result.userId
    } catch (error) {
      return null
    }
  }  
}
