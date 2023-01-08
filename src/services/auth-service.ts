import { trim } from 'lodash'
import bcrypt from 'bcrypt'
import { add } from 'date-fns'
import { userService } from './user-service'
import { userRepository } from '../repositories/user/user-db-repository'
import { emailManager } from '../managers'
import { getNextStrId, getConfirmationCode } from '../utils'
import { UserType, ServiceAuthType } from '../types'

export const authService: ServiceAuthType = {
  async registerUser({ login, password, email }) {
    const passwordSalt = bcrypt.genSaltSync(10)
    const passwordHash = await userService._generateHash(password, passwordSalt)
    
    const confirmationCode = getConfirmationCode()

    const newUser: UserType = {
      id: getNextStrId(),
      accountData: {
        login: trim(String(login)),
        email: trim(String(email)),
        passwordHash,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode,
        expirationDate: add(new Date(), { hours: 1, minutes: 30 }),
        isConfirmed: false
      },
    }

    const registeredUser = await userRepository.createdUser(newUser)

    try {      
      await emailManager.sendEmailCreatedUser(newUser.accountData.email, confirmationCode)
      return registeredUser
    } catch (error) {
      await userRepository.deleteUserById(newUser.id)
      console.log('error', error)
      return null
    }
  },
  async confirmEmail(code) {
    const user = await userRepository.findByConfirmationCode(code)

    if (!user) {
      return false
    }

    if (user.emailConfirmation.isConfirmed) {
      return false
    }

    if (user.emailConfirmation.expirationDate < new Date()) {
      return false
    }

    const isConfirmed = await userRepository.updateConfirmationByCode(code)

    return isConfirmed
  },
  async resendingCode(email) {
    const user = await userRepository.findByLoginOrEmail(email)

    if (!user) {
      return false
    }

    if (user.emailConfirmation.isConfirmed) {
      return false
    }

    if (user.emailConfirmation.expirationDate < new Date()) {
      return false
    }
    
    try {
      await emailManager.sendEmailCreatedUser(user.accountData.email, user.emailConfirmation.confirmationCode)
      return true
    } catch (error) {
      console.log('error', error)
      return false
    }
  },
  async checkCredentials(loginOrEmail, password) {
    const user = await userRepository.findByLoginOrEmail(loginOrEmail)

    if (!user) {
      return null
    }

    const passwordSalt = user.accountData.passwordHash.slice(0, 29)
    const passwordHash = await this._generateHash(password, passwordSalt)
    
    if (passwordHash !== user.accountData.passwordHash) {
      return null
    }

    return user
  },

  // Проверяем существует ли пользователь по логину и email
  async checkExistsUser(loginOrEmail) {
    const user = await userRepository.findByLoginOrEmail(loginOrEmail)

    if (user) {
      return true
    }

    return false
  },

  // Проверяем существует ли confirmationCode
  async checkExistsConfirmationCode(confirmationCode) {
    const user = await userRepository.findByConfirmationCode(confirmationCode)

    if (user) {
      return true
    }

    return false
  },

  // Формируем hash из пароля и его соли
  async _generateHash(password, salt) {
    const hash = await bcrypt.hash(password, salt)
    return hash
  },
}
