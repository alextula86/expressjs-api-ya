import { UserViewModel } from '../../models'
import { UserType } from '../../schema'
import { CreaetUserService } from '../../service'

export type ServiceAuthType = {
  registerUser: ({ login, password, email }: CreaetUserService) => Promise<UserViewModel | null>
  confirmEmail: (code: string) => Promise<boolean>
  resendingCode: (email: string) => Promise<boolean>
  checkCredentials: (loginOrEmail: string, password: string) => Promise<UserType | null>
  checkExistsUser: (loginOrEmail: string) => Promise<boolean>
  checkExistsConfirmationCode: (confirmationCode: string) => Promise<boolean>
  _generateHash: (password: string, salt: string) => Promise<string>
}
