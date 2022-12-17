import { userCollection } from '../db'
import { RepositoryUserType, SortDirection, UserType } from '../../types'

export const userRepository: RepositoryUserType = {
  async findAllUsers({
    searchLoginTerm,
    searchEmailTerm,
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
  }) {
    const number = pageNumber ? Number(pageNumber) : 1
    const size = pageSize ? Number(pageSize) : 10

    const filter: any = {}
    const sort: any = { [sortBy]: sortDirection === SortDirection.ASC ? 1 : -1 }

    if (searchLoginTerm) {
      filter['$or'].push({ login: { $regex: searchLoginTerm, $options: 'i' } })
    }

    if (searchEmailTerm) {
      filter['$or'].push({ email: { $regex: searchEmailTerm, $options: 'i' } })
    }

    const totalCount = await userCollection.count(filter)
    const pagesCount = Math.ceil(totalCount / size)
    const skip = (number - 1) * size

    const users: UserType[] = await userCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(size)
      .toArray()

    return this._getUsersViewModelDetail({
      items: users,
      totalCount,
      pagesCount,
      page: number,
      pageSize: size,
    })
  },
  async findUserById(id) {
    const foundUser: UserType | null = await userCollection.findOne({ id })

    if (!foundUser) {
      return null
    }

    return this._getUserViewModel(foundUser)
  },
  async createdUser(createdUser) {
    await userCollection.insertOne(createdUser)

    return this._getUserViewModel(createdUser)
  },
  async deleteUserById(id) {
    const { deletedCount } = await userCollection.deleteOne({ id })

    return deletedCount === 1
  },
  async findByLoginOrEmail(loginOrEmail: string) {
    const foundUser: UserType | null = await userCollection.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] })

    if (!foundUser) {
      return null
    }

    return foundUser
  },
  
  _getUserViewModel(dbUser) {
    return {
      id: dbUser.id,
      login: dbUser.login,
      email: dbUser.email,
      // passwordHash: dbUser.passwordHash,
      createdAt: dbUser.createdAt,
    }
  },
  _getUsersViewModelDetail({ items, totalCount, pagesCount, page, pageSize }) {
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: items.map(item => ({
        id: item.id,
        login: item.login,
        email: item.email,
        // passwordHash: item.passwordHash,
        createdAt: item.createdAt,
      })),
    }
  },
}
