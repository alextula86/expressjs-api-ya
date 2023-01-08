import { UserViewModel, UserAuthViewModel, QueryUserModel } from '../models'
import { UserType } from '../schema'
import { ResponseViewModelDetail } from '../response'

export type RepositoryUserType = {
  findAllUsers: ({ searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection }: QueryUserModel) => Promise<ResponseViewModelDetail<UserViewModel>>
  findUserById: (id: string) => Promise<UserAuthViewModel | null>
  findByLoginOrEmail: (loginOrEmail: string) => Promise<UserType | null>
  findByConfirmationCode: (code: string) => Promise<UserType | null>
  createdUser: (dbUser: UserType) => Promise<UserViewModel>
  deleteUserById: (id: string) => Promise<boolean>
  updateConfirmationByCode: (code: string) => Promise<boolean>
  updateConfirmationCodeByEmail: (email: string, code: string) => Promise<boolean>
  _getUserViewModel: (dbUser: UserType) => UserViewModel
  _getUsersViewModelDetail: ({ items, totalCount, pagesCount, page, pageSize }: ResponseViewModelDetail<UserType>) => ResponseViewModelDetail<UserViewModel>
  _getUserAuthViewModel: (dbUser: UserType) => UserAuthViewModel
}
