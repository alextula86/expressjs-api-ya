import { UserViewModel, QueryUserModel } from '../models'
import { UserType } from '../schema'
import { ResponseViewModelDetail } from '../response'

export type RepositoryUserType = {
  findAllUsers: ({ searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection }: QueryUserModel) => Promise<ResponseViewModelDetail<UserViewModel>>
  findUserById: (id: string) => Promise<UserViewModel | null>
  createdUser: ({ id, login, email, passwordHash, createdAt }: UserType) => Promise<UserViewModel>
  deleteUserById: (id: string) => Promise<boolean>
  findByLoginOrEmail: (loginOrEmail: string) => Promise<UserType | null>
  _getUserViewModel: ({ id, login, email, passwordHash, createdAt }: UserType) => UserViewModel
  _getUsersViewModelDetail: ({ items, totalCount, pagesCount, page, pageSize }: ResponseViewModelDetail<UserType>) => ResponseViewModelDetail<UserViewModel>
}
