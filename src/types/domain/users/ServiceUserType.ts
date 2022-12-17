import { UserViewModel, QueryUserModel } from '../../models'
import { ResponseViewModelDetail } from '../../response'
import { CreaetUserService } from '../users'

export type ServiceUserType = {
  findAllUsers: ({ searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection}: QueryUserModel) => Promise<ResponseViewModelDetail<UserViewModel>>
  findUserById: (id: string) => Promise<UserViewModel | null>
  createdUser: ({ login, password, email }: CreaetUserService) => Promise<UserViewModel>
  deleteUserById: (id: string) => Promise<boolean>
  checkCredentials: (loginOrEmail: string, password: string) => Promise<boolean>
  _generateHash: (password: string, salt: string) => Promise<string>
}
