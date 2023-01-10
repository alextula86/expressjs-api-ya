import { trim } from 'lodash'
import bcrypt from 'bcrypt'
import { add } from 'date-fns'
import { userService } from './user-service'
import { userRepository } from '../repositories/user/user-db-repository'
import { emailManager } from '../managers'
import { getNextStrId, generateConfirmationCode } from '../utils'
import { UserType, ServiceAuthType } from '../types'

export const authService: ServiceAuthType = {
  // Регистрация пользователя
  async registerUser({ login, password, email }) {
    // Формируем соль
    const passwordSalt = bcrypt.genSaltSync(10)
    // Формируем хэш пароля
    const passwordHash = await userService._generateHash(password, passwordSalt)
    // Генерируем код для подтверждения email
    const confirmationCode = generateConfirmationCode()
    // Формируем пользователя
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
        isConfirmed: false,
      },
    }

    // Создаем пользователя
    const registeredUser = await userRepository.createdUser(newUser)

    try {
      // Отправляем код подтверждения email
      await emailManager.sendEmailCreatedUser(newUser.accountData.email, confirmationCode)
      // Возвращаем сформированного пользователя
      return registeredUser
    } catch (error) {
      // Если письмо не отправилось, то удаляем добавленного пользователя
      await userRepository.deleteUserById(newUser.id)
      console.log('error', error)
      // Возвращаем null
      return null
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
  // Подтверждение email по коду
  async confirmEmail(code) {
    // Обновляем признак подтвержения по коду подтверждения
    const isConfirmed = await userRepository.updateConfirmationByCode(code)

    // Возвращаем подтвержен(true) / не подтвержден(false)
    return isConfirmed
  },
  // Повторная отправка кода подтверждения email
  async resendingCode(email) {
    // Генерируем код для подтверждения email
    const confirmationCode = generateConfirmationCode()

    // Обновляем код подтвержения
    const isUpdatedConfirmationCode = await userRepository.updateConfirmationCodeByEmail(email, confirmationCode)

    try {
      // Если обновление кода подтверждения email прошло успешно, отправляем письмо
      if (isUpdatedConfirmationCode) {
        await emailManager.sendEmailCreatedUser(email, confirmationCode)
      }
      // Возвращаем результат обнорвления кода подтверждения email
      return isUpdatedConfirmationCode
    } catch (error) {
      console.log('error', error)
      // Возвращаем false
      return false
    }
  },
  // Проверяем существует ли пользователь по логину
  async checkExistsUserByLoginOrEmail(loginOrEmail) {
    const user = await userRepository.findByLoginOrEmail(loginOrEmail)

    if (!user) {
      return null
    }

    return user
  },
  // Проверяем существует ли пользователь по email
  async checkExistsUserByEmail(email) {
    const user = await userRepository.findByLoginOrEmail(email)

    if (!user) {
      return null
    }

    return user
  },
  // Проверяем существует ли пользователь по коду подтверждения email
  async checkExistsConfirmationCode(confirmationCode) {
    const user = await userRepository.findByConfirmationCode(confirmationCode)

    if (!user) {
      return null
    }

    return user
  },

  // Формируем hash из пароля и его соли
  async _generateHash(password, salt) {
    const hash = await bcrypt.hash(password, salt)
    return hash
  },
}
