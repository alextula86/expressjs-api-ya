import { UserType } from '../../schema'
import { CreaetUserService } from '..'

export type ServiceAuthType = {
  registerUser: ({ login, password, email }: CreaetUserService) => Promise<any>
  confirmEmail: (code: string) => Promise<boolean>
  resendingCode: (email: string) => Promise<boolean>
  checkCredentials: (loginOrEmail: string, password: string) => Promise<UserType | null>
  _generateHash: (password: string, salt: string) => Promise<string>
}
