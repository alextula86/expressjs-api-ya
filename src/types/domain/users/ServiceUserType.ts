import { UserViewModel, QueryUserModel } from '../../models'
import { ResponseViewModelDetail } from '../../response'
import { CreaetUserService } from '..'

export type ServiceUserType = {
  findAllUsers: ({ searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection}: QueryUserModel) => Promise<ResponseViewModelDetail<UserViewModel>>
  findUserById: (id: string) => Promise<UserViewModel | null>
  createdUser: ({ login, password, email }: CreaetUserService) => Promise<UserViewModel>
  deleteUserById: (id: string) => Promise<boolean>
  _generateHash: (password: string, salt: string) => Promise<string>
}
