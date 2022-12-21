import jwt from 'jsonwebtoken'
import { settings } from '../settings'
import { UserViewModel } from '../types/models'

export const jwtService = {
  async createJWT (user: UserViewModel) {
    const token = jwt.sign({ userId: user.id }, settings.JWT_SECRET, { expiresIn: '7d' })

    return { accessToken: token }
  }, 
  async getUserIdByToken (token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET)
      return result.userId
    } catch (error) {
      return null
    }
  }
}
