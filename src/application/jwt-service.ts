import jwt from 'jsonwebtoken'
import { settings } from '../settings'

export const jwtService = {
  async createAccessToken (userId: string) {
    const accessToken = jwt.sign({ userId }, settings.ACCESS_TOKEN_SECRET, { expiresIn: '10h' })
    return accessToken
  },
  async createRefreshToken (userId: string) {
    const refreshToken = jwt.sign({ userId }, settings.REFRESH_TOKEN_SECRET, { expiresIn: '20h' })
    return refreshToken
  },   
  async getUserIdByAccessToken (token: string) {
    console.log('getUserIdByAccessToken token', token)
    console.log('settings.ACCESS_TOKEN_SECRET', settings.ACCESS_TOKEN_SECRET)
    try {
      const result: any = jwt.verify(token, settings.ACCESS_TOKEN_SECRET)
      console.log('getUserIdByRefreshToken result', result)
      return result.userId
    } catch (error) {
      return null
    }
  },
  async getUserIdByRefreshToken (token: string) {
    console.log('getUserIdByRefreshToken token', token)
    console.log('settings.REFRESH_TOKEN_SECRET', settings.REFRESH_TOKEN_SECRET)
    try {
      const result: any = jwt.verify(token, settings.REFRESH_TOKEN_SECRET)
      console.log('getUserIdByRefreshToken result', result)
      return result.userId
    } catch (error) {
      console.log('error', error)
      return null
    }
  }  
}
