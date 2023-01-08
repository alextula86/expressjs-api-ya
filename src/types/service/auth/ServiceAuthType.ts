import { UserViewModel } from '../../models'
import { UserType } from '../../schema'
import { CreaetUserService } from '../../service'

export type ServiceAuthType = {
  registerUser: ({ login, password, email }: CreaetUserService) => Promise<UserViewModel | null>
  confirmEmail: (code: string) => Promise<boolean>
  resendingCode: (email: string) => Promise<boolean>
  checkCredentials: (loginOrEmail: string, password: string) => Promise<UserType | null>
  checkExistsUserByLoginOrEmail: (loginOrEmail: string) => Promise<UserType | null>
  checkExistsUserByEmail: (email: string) => Promise<UserType | null>
  checkExistsConfirmationCode: (confirmationCode: string) => Promise<UserType | null>
  _generateHash: (password: string, salt: string) => Promise<string>
}
