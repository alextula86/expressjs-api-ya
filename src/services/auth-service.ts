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
  // Подтверждение email по коду
  async confirmEmail(code) {
    // Ищем пользователя по коду
    const user = await userRepository.findByConfirmationCode(code)

    // Если пользователь по коду не найден, останавливаем выполнение
    if (!user) {
      return false
    }

    // Если дата для подтверждения email по коду просрочена, останавливаем выполнение
    if (user.emailConfirmation.expirationDate < new Date()) {
      return false
    }

    // Если email уже подтвержден, останавливаем выполнение
    if (user.emailConfirmation.isConfirmed) {
      return false
    }

    // Обновляем признак подтвержения по коду подтверждения
    const isConfirmed = await userRepository.updateConfirmationByCode(code)

    // Возвращаем подтвержен(true) / не подтвержден(false)
    return isConfirmed
  },
  // Повторная отправка кода подтверждения email
  async resendingCode(email) {
    // Ищем пользователя по email
    const user = await userRepository.findByLoginOrEmail(email)
    // Если пользователь по email не найден, останавливаем выполнение
    if (!user) {
      return false
    }

    // Если дата для подтверждения email по коду просрочена, останавливаем выполнение
    if (user.emailConfirmation.expirationDate < new Date()) {
      return false
    }

    // Если email уже подтвержден, останавливаем выполнение
    if (user.emailConfirmation.isConfirmed) {
      return false
    }

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
